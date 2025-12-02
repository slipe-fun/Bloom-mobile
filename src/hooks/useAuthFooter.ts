import { useCallback, useMemo } from "react";
import axios from "axios";
import useAuthStore from "@stores/auth";
import useStorageStore from "@stores/storage";
import { API_URL } from "@constants/Api";
import { ROUTES } from "@constants/routes";

export default function useAuthFooter(navigation: any) {
  const { index, email, emailValid, otp, password, setError } = useAuthStore();
  const { mmkv } = useStorageStore();

  const isDisabled = useMemo(() => {
    if (index === 1) return !emailValid;
    if (index === 2) return otp.length < 6;
    return false;
  }, [index, emailValid, otp]);

  const progressValue = useMemo(() => {
    if (index === 0) return 0;
    if (index === 1) return emailValid ? 2 : 1;
    if (index === 2) return otp.length >= 6 ? 2 : 1;
    return password.length >= 8 ? 2 : 1;
  }, [index, emailValid, otp, password]);

  const label = index === 0 ? "Продолжить с Почтой" : index === 3 ? "Завершить" : "Продолжить";

  const handlePress = useCallback(async () => {
    try {
      switch (index) {
        case 0:
          navigation.navigate(ROUTES.auth.signup.email);
          break;

        case 1: {
          const checkRes = await axios.get(`${API_URL}/user/exists`, { params: { email } });
          const isUserExists = checkRes.data?.exists;

          if (isUserExists === undefined) throw new Error("Failed to check user");

          if (isUserExists) {
            axios.post(`${API_URL}/auth/request-code`, { email }).catch(console.error);
          } else {
            const regRes = await axios.post(`${API_URL}/auth/register`, { email });
            if (regRes.data?.error) throw new Error("Failed to register");
          }
          navigation.navigate(ROUTES.auth.signup.otp);
          break;
        }

        case 2: {
          const verifyRes = await axios.post(`${API_URL}/auth/verify-code`, { email, code: otp });
          const { token, user } = verifyRes.data || {};

          if (token) {
            mmkv.set("token", token);
            mmkv.set("user_id", String(user?.id));
            mmkv.set("user", JSON.stringify(user));
            navigation.navigate(ROUTES.auth.signup.password);
          } else {
            console.log("Wrong code");
          }
          break;
        }
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
  }, [index, email, otp, navigation, setError, mmkv]);

  return {
    index,
    label,
    isDisabled,
    progressValue,
    handlePress,
  };
};
