import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Background } from "@/components/playbook/Background";
import { TopScrim } from "@/components/playbook/TopScrim";
import { HeaderScrollProvider } from "@/lib/HeaderScrollContext";
import { useTheme } from "@/lib/ThemeContext";
import {
  getScreenTopPadding,
  getStackScrollBottomPadding,
  getTabScrollBottomPadding,
} from "@/lib/screenInsets";

/** Baseline compact header height before onLayout (avoids first-frame overlap). */
function estimateTabHeaderHeight(insets: { top: number }): number {
  return getScreenTopPadding(insets, 8) + 54;
}

function resolveContentTopSpacing(
  contentContainerStyle: StyleProp<ViewStyle> | undefined
): number {
  const flat = StyleSheet.flatten(contentContainerStyle);
  return typeof flat?.paddingTop === "number" ? flat.paddingTop : 0;
}

interface CollapsibleScreenProps {
  /** Pinned top chrome that stays visible while content scrolls underneath. */
  header?: React.ReactNode;
  children: React.ReactNode;
  variant?: "tab" | "stack";
  bottomSpacing?: number;
  glow?: boolean;
  scrollProps?: ScrollViewProps;
}

/**
 * Full-height edge-to-edge screen with optional sticky header, top scrim, and
 * scroll content.
 */
export const CollapsibleScreen: React.FC<CollapsibleScreenProps> = ({
  header,
  children,
  variant = "tab",
  bottomSpacing,
  glow = true,
  scrollProps,
}) => {
  const insets = useSafeAreaInsets();
  const { mode } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const hasHeader = header != null;
  const [headerHeight, setHeaderHeight] = useState(() =>
    hasHeader ? estimateTabHeaderHeight(insets) : 0
  );

  const paddingBottom =
    variant === "tab"
      ? getTabScrollBottomPadding(insets, bottomSpacing)
      : getStackScrollBottomPadding(insets, bottomSpacing);

  const scrimFade = scrollY.interpolate({
    inputRange: [0, 40, 120],
    outputRange: [0.5, 0.72, 0.95],
    extrapolate: "clamp",
  });

  const {
    contentContainerStyle,
    onScroll: externalOnScroll,
    scrollEventThrottle = 16,
    showsVerticalScrollIndicator = false,
    contentInsetAdjustmentBehavior = "never",
    automaticallyAdjustsScrollIndicatorInsets = false,
    style,
    ...restScrollProps
  } = scrollProps ?? {};

  const externalOnScrollRef = useRef(externalOnScroll);
  externalOnScrollRef.current = externalOnScroll;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.setValue(event.nativeEvent.contentOffset.y);
      externalOnScrollRef.current?.(event);
    },
    [scrollY]
  );

  const handleHeaderLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const height = event.nativeEvent.layout.height;
      setHeaderHeight((prev) => (prev === height ? prev : height));
    },
    []
  );

  const contentTopSpacing = resolveContentTopSpacing(contentContainerStyle);
  const scrollPaddingTop = hasHeader
    ? headerHeight + contentTopSpacing
    : contentTopSpacing || undefined;

  return (
    <Background glow={glow}>
      <View style={styles.root}>
        <Animated.ScrollView
          {...restScrollProps}
          automaticallyAdjustsScrollIndicatorInsets={
            automaticallyAdjustsScrollIndicatorInsets
          }
          contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
          scrollEventThrottle={scrollEventThrottle}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          style={[styles.scroll, style]}
          contentContainerStyle={[
            contentContainerStyle,
            { paddingBottom },
            scrollPaddingTop != null ? { paddingTop: scrollPaddingTop } : null,
          ]}
          onScroll={handleScroll}
        >
          {children}
        </Animated.ScrollView>

        {hasHeader ? (
          <View
            onLayout={handleHeaderLayout}
            style={styles.stickyHeader}
          >
            <HeaderScrollProvider value={scrollY}>{header}</HeaderScrollProvider>
          </View>
        ) : null}

        <TopScrim key={mode} scrollFade={scrimFade} />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  stickyHeader: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 15,
  },
});

export default CollapsibleScreen;
