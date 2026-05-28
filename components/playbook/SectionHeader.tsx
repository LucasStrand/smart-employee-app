import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";

interface Props {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  eyebrow?: string;
}

export const SectionHeader: React.FC<Props> = ({
  title,
  actionLabel,
  onActionPress,
  eyebrow,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 14,
        marginTop: 6,
      }}
    >
      <View>
        {eyebrow && (
          <Text
            style={{
              color: colors.brand,
              fontFamily: "Jakarta-SemiBold",
              fontSize: 11,
              letterSpacing: 1.1,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {eyebrow}
          </Text>
        )}
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-Bold",
            fontSize: 20,
            letterSpacing: -0.4,
          }}
        >
          {title}
        </Text>
      </View>
      {actionLabel && (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.7}
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Text
            style={{
              color: colors.brand,
              fontSize: 13,
              fontFamily: "Jakarta-SemiBold",
            }}
          >
            {actionLabel}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.brand} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
