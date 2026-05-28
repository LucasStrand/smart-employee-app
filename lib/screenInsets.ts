import { Platform } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

const NATIVE_TAB_BAR_HEIGHT = Platform.select({
  ios: 49,
  android: 64,
  default: 64,
}) as number;

/** Floating pill tab bar on web (_layout.web.tsx). */
const WEB_FLOATING_TAB_BAR_HEIGHT = 88;

export function getScreenTopPadding(insets: EdgeInsets, extra = 8): number {
  return insets.top + extra;
}

export function getTabScrollBottomPadding(
  insets: EdgeInsets,
  spacing = 20
): number {
  if (Platform.OS === "web") {
    return WEB_FLOATING_TAB_BAR_HEIGHT + spacing;
  }
  return insets.bottom + NATIVE_TAB_BAR_HEIGHT + spacing;
}

export function getStackScrollBottomPadding(
  insets: EdgeInsets,
  spacing = 24
): number {
  return insets.bottom + spacing;
}
