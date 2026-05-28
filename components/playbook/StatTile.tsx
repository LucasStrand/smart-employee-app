import React from "react";
import { Text, View, ViewStyle } from "react-native";

import { useTheme } from "@/lib/ThemeContext";

interface Props {
  label: string;
  value: string;
  accent?: boolean;
  style?: ViewStyle;
}

export const StatTile: React.FC<Props> = ({
  label,
  value,
  accent,
  style,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: accent ? colors.brandGlow : colors.surface,
          borderColor: accent ? colors.borderBrand : colors.border,
          borderWidth: 1,
          borderRadius: 14,
          padding: 14,
          flex: 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: colors.textSubtle,
          fontFamily: "Jakarta-SemiBold",
          fontSize: 10.5,
          letterSpacing: 0.8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: accent ? colors.brand : colors.text,
          fontFamily: "Jakarta-ExtraBold",
          fontSize: 22,
          letterSpacing: -0.5,
          marginTop: 4,
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export default StatTile;
