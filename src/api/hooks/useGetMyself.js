import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@constants/Api";
import { createSecureStorage } from "@lib/Storage";

export default function () {
    // variables
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // mmkv storage
                const Storage = await createSecureStorage("user-storage");
                // get user token from mmkv storage
                const token = Storage.getString("token");

                // send get user info request
                const response = await axios.get(`${API_URL}/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response?.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { loading, error, user };
}
