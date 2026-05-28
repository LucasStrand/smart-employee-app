import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "access_token";
const LOCAL_USER_ID_KEY = "local_user_id";

export const getAccessToken = () => AsyncStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string) =>
  AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);

export const clearSession = async () => {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, LOCAL_USER_ID_KEY]);
};
