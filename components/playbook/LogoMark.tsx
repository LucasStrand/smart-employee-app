import React from "react";
import { Image, Text, View } from "react-native";

import { useTheme } from "@/lib/ThemeContext";
import { images } from "@/constants";

interface Props {
  size?: number;
  showWordmark?: boolean;
  wordmark?: string;
  subtitle?: string;
}

export const LogoMark: React.FC<Props> = ({
  size = 44,
  showWordmark = false,
  wordmark = "Smart Teknik",
  subtitle = "Standard",
}) => {
  const { colors, mode } = useTheme();
  const logoSource = mode === "dark" ? images.logoWhite : images.logo;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Image
        source={logoSource}
        style={{
          width: size * 1.6,
          height: size,
          resizeMode: "contain",
        }}
      />
      {showWordmark && (
        <View>
          <Text
            style={{
              color: colors.text,
              fontFamily: "Jakarta-ExtraBold",
              fontSize: 16,
              letterSpacing: -0.3,
            }}
          >
            {wordmark}
          </Text>
          <Text
            style={{
              color: colors.brand,
              fontFamily: "Jakarta-SemiBold",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginTop: 1,
            }}
          >
            {subtitle}
          </Text>
        </View>
      )}
    </View>
  );
};

export default LogoMark;
