import React from "react";
import { TextInput, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showFilter?: boolean;
  onFilterPress?: () => void;
}

export const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = "Sök i manualen…",
  autoFocus,
  showFilter,
  onFilterPress,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderRadius: 14,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Ionicons name="search-outline" size={18} color={colors.textSubtle} />
        <TextInput
          autoFocus={autoFocus}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          style={{
            flex: 1,
            color: colors.text,
            fontFamily: "Jakarta",
            fontSize: 14.5,
            padding: 0,
          }}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")} hitSlop={10}>
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textSubtle}
            />
          </TouchableOpacity>
        )}
      </View>
      {showFilter && (
        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.7}
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="options-outline" size={18} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
