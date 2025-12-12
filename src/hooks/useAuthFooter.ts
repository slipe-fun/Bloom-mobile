import { useCallback, useMemo } from "react";
import axios from "axios";
import useAuthStore from "@stores/auth";
import useStorageStore from "@stores/storage";
import { API_URL } from "@constants/Api";
import { ROUTES } from "@constants/routes";
import { decryptKeys, encryptKeys, hashPassword } from "@lib/skid/encryptKeys";
import { Buffer } from '@craftzdog/react-native-buffer';

export default function useAuthFooter(navigation: any) {
  const { index, email, emailValid, otp, password, setError, error } = useAuthStore();
  const { mmkv } = useStorageStore();

  const isDisabled = useMemo(() => {
    if (index === 1) return !emailValid;
    if (index === 2) return otp.length < 6;
    if (index === 3) return password.length < 6
    return false;
  }, [index, emailValid, otp]);

  const progressValue = useMemo(() => {
    if (index === 0) return 0;
    if (index === 1) return emailValid ? 2 : 1;
    if (index === 2) return otp.length >= 6 ? 2 : 1;
    if (index === 3) return password.length >= 6 ? 2 : 1;
    if (error) return 3;
    return password.length >= 8 ? 2 : 1;
  }, [index, emailValid, otp, password, error]);

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
            setError("Неверный код подтверждения. Попробуйте ещë раз")
          }
          break;
        }

        case 3: {
          const token = mmkv.getString("token")
          const privateKeys = await axios.get(`${API_URL}/chats/keys/private`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res?.data).catch(console.error);

          if (!privateKeys) {
            const { hash, salt } = await hashPassword(password);
            const { ciphertext, nonce } = encryptKeys(hash, new TextEncoder().encode("[]"));

            await axios.post(`${API_URL}/chats/keys/private`, { ciphertext, nonce, salt: Buffer.from(salt).toString("base64") }, {
              headers: { Authorization: `Bearer ${token}` },
            })

            mmkv.set("password", Buffer.from(hash).toString("base64"));
          } else {
            const { hash } = await hashPassword(password, Buffer.from(privateKeys?.salt, "base64"));

            try {
              const keys = decryptKeys(hash, privateKeys?.ciphertext, privateKeys?.nonce)

              console.log(keys)
            } catch {
              console.log("FAILED TO DECRYPT KEYS");
            }
          }
        }
      }
    } catch (e: any) {
      console.log(e)
      setError(e.response.data || e.message || "Something went wrong");
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
