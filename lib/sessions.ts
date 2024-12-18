import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSession = async () => {
  return await AsyncStorage.getItem("access_token");
};

export const clearSession = async () => {
  await AsyncStorage.removeItem("access_token");
};
