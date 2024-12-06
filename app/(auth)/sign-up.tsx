import React from "react";
import { View, ScrollView, Image, Text } from "react-native";
import { images, icons } from "@/constants";
import { useCallback, useState } from "react";
import InputField from "@/components/InputField";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.SMFasad} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-2 left-5">
            Välkommen hit 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Namn"
            placeholder="Skriv ditt namn"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
            inputStyle="placeholder:text-gray-400"
          />
          <InputField
            label="E-post"
            placeholder="Skriv din e-post"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            inputStyle="placeholder:text-gray-400"
          />
          <InputField
            label="Lösenord"
            placeholder="Skriv ditt lösenord"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            inputStyle="placeholder:text-gray-400"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
