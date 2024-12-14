import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(Boolean);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Fel", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        console.log("Verification Incomplete:", completeSignUp);
        setVerification((prev) => ({
          ...prev,
          error: "Verifieringen misslyckades. Försök igen.",
          state: "failed",
        }));
      }
    } catch (err: any) {
      console.log("Verification Error:", err);
      setVerification((prev) => ({
        ...prev,
        error: err.errors[0]?.longMessage || "Något gick fel. Försök igen.",
        state: "failed",
      }));
    }
  };
  useEffect(() => {
    console.log("Verification State:", verification.state);
  }, [verification.state]);

  useEffect(() => {
    console.log("Success Modal Visibility:", showSuccessModal);
  }, [showSuccessModal]);

  const animationRef = useRef<NodeJS.Timeout | null>(null);

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
            Skapa ditt konto
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
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Har du redan ett konto?{" "}
            <Text className="text-primary-500">Logga In</Text>
          </Link>
        </View>

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          animationOutTiming={300}
          onModalHide={() => {
            if (verification.state === "success") {
              animationRef.current = setTimeout(() => {
                setShowSuccessModal(true);
              }, 300);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verifiering
            </Text>
            <Text className="font-Jakarta mb-5">
              Vi har skickat en verifieringskod till {form.email}.
            </Text>
            <InputField
              label={"Kod"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code: string) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verifiera E-post"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verifierad
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              Ditt konto har verifierats framgångsrikt.
            </Text>
            <CustomButton
              title="Bläddra Hem"
              onPress={() => {
                setShowSuccessModal(false);
                router.push(`/(root)/(tabs)/home`);
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
