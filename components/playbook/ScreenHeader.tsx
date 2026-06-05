import React, { useMemo } from "react";
import { Animated, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { GlassIconButton } from "@/components/glass/GlassIconButton";
import {
  HEADER_TITLE_FADE_DISTANCE,
  useHeaderScrollY,
} from "@/lib/HeaderScrollContext";
import { getScreenTopPadding } from "@/lib/screenInsets";
import { useTheme } from "@/lib/ThemeContext";

interface Props {
  title: string;
  scrollY?: Animated.Value;
  onBack?: () => void;
  trailing?: React.ReactNode;
  /** Shorthand for a single trailing icon button. Ignored when `trailing` is set. */
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onTrailingPress?: () => void;
  trailingBadged?: boolean;
  style?: ViewStyle;
}

/** Compact toolbar header — page title only, optional back/trailing actions. */
export const ScreenHeader: React.FC<Props> = ({
  title,
  scrollY: scrollYProp,
  onBack,
  trailing,
  trailingIcon,
  onTrailingPress,
  trailingBadged,
  style,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const contextScrollY = useHeaderScrollY();
  const scrollY = scrollYProp ?? contextScrollY;
  const fadeEnd = HEADER_TITLE_FADE_DISTANCE;

  const titleOpacity = useMemo(
    () =>
      scrollY?.interpolate({
        inputRange: [0, fadeEnd],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
    [scrollY, fadeEnd]
  );

  const titleTranslateY = useMemo(
    () =>
      scrollY?.interpolate({
        inputRange: [0, fadeEnd],
        outputRange: [0, -8],
        extrapolate: "clamp",
      }),
    [scrollY, fadeEnd]
  );

  const trailingNode =
    trailing ??
    (trailingIcon ? (
      <GlassIconButton
        badged={trailingBadged}
        icon={trailingIcon}
        onPress={onTrailingPress}
      />
    ) : null);

  const hasLeading = onBack != null;
  const hasTrailing = trailingNode != null;
  const centerTitle = hasLeading && hasTrailing;

  const titleStyle = {
    color: colors.text,
    fontFamily: "Jakarta-Bold" as const,
    fontSize: 17,
    letterSpacing: -0.3,
    textAlign: (centerTitle ? "center" : "left") as "center" | "left",
  };

  return (
    <View
      style={[
        {
          paddingHorizontal: 20,
          paddingTop: getScreenTopPadding(insets, 8),
          paddingBottom: 10,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          minHeight: 44,
          gap: 4,
        }}
      >
        {hasLeading ? (
          <GlassIconButton
            accessibilityLabel="Tillbaka"
            icon="chevron-back"
            onPress={onBack}
          />
        ) : null}

        {scrollY && titleOpacity && titleTranslateY ? (
          <Animated.View
            style={{
              flex: 1,
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            }}
          >
            <Text style={titleStyle} numberOfLines={1}>
              {title}
            </Text>
          </Animated.View>
        ) : (
          <Text style={[titleStyle, { flex: 1 }]} numberOfLines={1}>
            {title}
          </Text>
        )}

        {hasTrailing ? (
          trailingNode
        ) : hasLeading ? (
          <View style={{ width: 44 }} />
        ) : null}
      </View>
    </View>
  );
};

export default ScreenHeader;
