import React, { useState } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Background } from "@/components/playbook/Background";
import { TopScrim } from "@/components/playbook/TopScrim";
import { useTheme } from "@/lib/ThemeContext";
import {
  getStackScrollBottomPadding,
  getTabScrollBottomPadding,
} from "@/lib/screenInsets";

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
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState(0);
  const hasHeader = header != null;

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.setValue(event.nativeEvent.contentOffset.y);
    externalOnScroll?.(event);
  };

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
            hasHeader ? { paddingTop: headerHeight } : null,
            contentContainerStyle,
            { paddingBottom },
          ]}
          onScroll={handleScroll}
        >
          {children}
        </Animated.ScrollView>

        {hasHeader ? (
          <View
            onLayout={(event) =>
              setHeaderHeight(event.nativeEvent.layout.height)
            }
            style={styles.stickyHeader}
          >
            {header}
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
