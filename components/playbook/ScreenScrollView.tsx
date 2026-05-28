import React from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  getStackScrollBottomPadding,
  getTabScrollBottomPadding,
} from "@/lib/screenInsets";

interface ScreenScrollViewProps extends ScrollViewProps {
  variant?: "tab" | "stack";
  bottomSpacing?: number;
}

/**
 * Edge-to-edge scroll container with safe bottom inset for tab bar / home indicator.
 */
export const ScreenScrollView: React.FC<ScreenScrollViewProps> = ({
  variant = "tab",
  bottomSpacing,
  contentContainerStyle,
  style,
  showsVerticalScrollIndicator = false,
  contentInsetAdjustmentBehavior = "never",
  automaticallyAdjustsScrollIndicatorInsets = false,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const paddingBottom =
    variant === "tab"
      ? getTabScrollBottomPadding(insets, bottomSpacing)
      : getStackScrollBottomPadding(insets, bottomSpacing);

  return (
    <ScrollView
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      automaticallyAdjustsScrollIndicatorInsets={
        automaticallyAdjustsScrollIndicatorInsets
      }
      style={[{ flex: 1 }, style]}
      contentContainerStyle={[contentContainerStyle, { paddingBottom }]}
      {...rest}
    />
  );
};

export default ScreenScrollView;
