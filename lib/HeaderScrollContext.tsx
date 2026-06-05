import React, { createContext, useContext } from "react";
import { Animated } from "react-native";

const HeaderScrollContext = createContext<Animated.Value | null>(null);

export function useHeaderScrollY(): Animated.Value | null {
  return useContext(HeaderScrollContext);
}

export const HeaderScrollProvider = HeaderScrollContext.Provider;

/** Pixels scrolled before the header title is fully hidden. */
export const HEADER_TITLE_FADE_DISTANCE = 56;
