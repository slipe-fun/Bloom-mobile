import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@constants/Api";


export default function (query = "") {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);

    async function fetchUser () {
        try {
            const response = await axios.get(`${API_URL}/user/search?q=${query}&offset=${(page - 1) * 12}&limit=12`);

            setUsers(response?.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    function addPage () {
        setPage(prev => prev + 1)
    }

    useEffect(() => {
        setUsers([]);
        setPage(1);
    }, [query])

    useEffect(() => {
        fetchUser();
    }, [query, page]);

    return { loading, error, users, addPage };
}
