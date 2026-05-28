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
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 14,
          backgroundColor: colors.brandGlow,
          borderWidth: 1,
          borderColor: colors.borderBrand,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          source={images.logo}
          style={{
            width: size * 0.72,
            height: size * 0.72,
            resizeMode: "contain",
          }}
        />
      </View>
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
