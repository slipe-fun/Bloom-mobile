import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { API_URL } from "@constants/Api";
import { createSecureStorage } from "@lib/Storage";
import { ROUTES } from "@constants/Routes";
import { useNavigation } from "@react-navigation/native";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storageRef = useRef(null);
  const navigation = useNavigation();

  const auth = useCallback(
    async (username, password, mode = "login") => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_URL}/auth/${mode}`;
        const res = await axios.post(url, { username: username?.toLowerCase(), password });

        await storageRef.current?.set("token", res.data?.token);
        await storageRef.current?.set("user_id", JSON.stringify(res.data?.user?.id));

        navigation.replace(ROUTES.MAIN);

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
