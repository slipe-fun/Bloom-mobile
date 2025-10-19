import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { API_URL } from "@constants/Api";
import { createSecureStorage } from "@lib/Storage";
import { ROUTES } from "@constants/Routes";
import { useNavigation } from "@react-navigation/native";

export default function useAuth() { 
  // variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storageRef = useRef(null);

  // screen navigation hook
  const navigation = useNavigation();

  const auth = useCallback(
    async (username, password, mode = "login") => {
      setLoading(true);
      setError(null);
      try {
        // form url and send request
        const url = `${API_URL}/auth/${mode}`;
        const res = await axios.post(url, { username: username?.toLowerCase(), password });

        // set token and user_id variables in mmkv storage
        await storageRef.current?.set("token", res.data?.token);
        await storageRef.current?.set("user_id", JSON.stringify(res.data?.user?.id));

        // set main screen (chats screen) if auth success
        navigation.replace(ROUTES.MAIN);

        // return response data
        return res.data;
      } catch (err) {
        setError(err.message || "Auth error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigation]
  );

  useEffect(() => {
    // init mmkv storage
    const init = async () => {
      storageRef.current = await createSecureStorage("user-storage");
    };
    init();
  }, []);

  return {
    loading,
    error,
    login: (u, p) => auth(u, p, "login"),
    signUp: (u, p) => auth(u, p, "register"),
  };
}
