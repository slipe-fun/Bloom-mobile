import { useState, useEffect } from "react";
import { createSecureStorage } from "@lib/storage";
import useTokenTriggerStore from "@stores/tokenTriggerStore";

export default function useTokenCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { counter } = useTokenTriggerStore();

  let listener;
  let storageInstance;

  const init = async () => {
    try {
      console.log(123);
      storageInstance = await createSecureStorage("user-storage");
      const token = storageInstance.getString("token");
      setIsAuthenticated(!!token);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    init();
    console.log(1233435);
  }, [counter]);

  return { isAuthenticated, isLoading };
}
