import { useState, useEffect } from "react";
import { createSecureStorage } from "@lib/Storage";

export default function useTokenCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let listener;
    let storageInstance;

    const init = async () => {
      try {
        storageInstance = await createSecureStorage("user-storage");
        const token = storageInstance.getString("token");
        setIsAuthenticated(!!token);

        listener = storageInstance.addOnValueChangedListener((changedKey) => {
          if (changedKey === "token") {
            const nextToken = storageInstance.getString("token");
            setIsAuthenticated(!!nextToken);
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    init();

    return () => {
      listener?.remove?.();
    };
  }, []);

  return { isAuthenticated, isLoading };
}
