import React, { useState, useEffect, useRef } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import { useRouter } from "expo-router";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
  });

  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const onSignUpPress = async () => {
    try {
      // Send user data to the backend
      const response = await fetchAPI("/(api)/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setVerification({ ...verification, state: "success" });
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Sign-Up Error:", err.message);
      Alert.alert("Fel", err.message || "Något gick fel. Försök igen.");
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.SMFasad} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Registrera dig hos oss
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Namn"
            placeholder="Skriv ditt namn"
            icon={icons.person}
            value={form.name}
            onChangeText={(value: string) => setForm({ ...form, name: value })}
          />
          <InputField
            label="E-post"
            placeholder="Skriv din e-postadress"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value: string) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Lösenord"
            placeholder="Skriv ditt lösenord"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value: string) =>
              setForm({ ...form, password: value })
            }
          />
          <CustomButton
            title="Skapa Konto"
            onPress={onSignUpPress}
            className="mt-6"
          />
          <OAuth />
          <Text className="text-lg text-center text-general-200 mt-10">
            Har du redan ett konto?{" "}
            <Text
              onPress={() => router.push("/sign-in")}
              className="text-primary-500"
            >
              Logga In
            </Text>
          </Text>
        </View>

        {/* Success Modal */}
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Registrering Slutförd
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              Ditt konto har skapats framgångsrikt.
            </Text>
            <CustomButton
              title="Logga In"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/sign-in");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
