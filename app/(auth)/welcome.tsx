import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";

const Onboarding = () => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<(typeof onboarding)[number]>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(nextIndex);
  };

  const goToNextSlide = () => {
    if (isLastSlide) {
      router.replace("/(auth)/sign-up");
      return;
    }

    flatListRef.current?.scrollToIndex({
      index: activeIndex + 1,
      animated: true,
    });
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={onboarding}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => (
          <View
            className="flex items-center justify-center p-5"
            style={{ width }}
          >
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        )}
      />

      <View className="flex flex-row items-center justify-center">
        {onboarding.map((item, index) => (
          <View
            key={item.id}
            className={`w-[32px] h-[4px] mx-1 rounded-full ${
              index === activeIndex ? "bg-[#FEBA17]" : "bg-[#E2E8F0]"
            }`}
          />
        ))}
      </View>

      <CustomButton
        title={isLastSlide ? "Kom igång" : "Nästa"}
        onPress={goToNextSlide}
        className="w-11/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
};

export default Onboarding;
