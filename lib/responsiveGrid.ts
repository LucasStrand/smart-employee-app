import { useWindowDimensions } from "react-native";

/** Viewport width at which a third column is allowed. */
export const WIDE_GRID_BREAKPOINT = 768;

/** Default gap between grid cells (rows and columns). */
export const GRID_GAP = 10;

/** Spacing between stacked list rows (chapters, search history, etc.). */
export const LIST_ROW_GAP = 10;

/**
 * Responsive column count: 2 by default, up to `maxColumns` on wide screens.
 */
export function useResponsiveColumnCount(maxColumns = 3): number {
  const { width } = useWindowDimensions();
  if (width >= WIDE_GRID_BREAKPOINT) {
    return Math.min(maxColumns, 3);
  }
  return 2;
}

/**
 * Pixel width for one grid cell, accounting for horizontal padding and gaps.
 */
export function getGridItemWidth(
  screenWidth: number,
  columnCount: number,
  options?: { gap?: number; horizontalPadding?: number }
): number {
  const gap = options?.gap ?? GRID_GAP;
  const horizontalPadding = options?.horizontalPadding ?? 0;
  const available =
    screenWidth - horizontalPadding * 2 - gap * Math.max(0, columnCount - 1);
  return available / columnCount;
}
