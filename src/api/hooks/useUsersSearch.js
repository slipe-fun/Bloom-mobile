import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@constants/Api";


export default function (query = "") {
    // variables
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);

    // fetch search users request function
    async function fetchUser() {
        try {
            // send search users request
            const response = await axios.get(`${API_URL}/user/search?q=${query}&offset=${(page - 1) * 12}&limit=12`);

            setUsers(response?.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // add pagination page function
    function addPage() {
        setPage(prev => prev + 1)
    }

    // reset variables if query changed
    useEffect(() => {
        setUsers([]);
        setPage(1);
    }, [query])

    // fetch search users if query or page changed
    useEffect(() => {
        fetchUser();
    }, [query, page]);

    return { loading, error, users, addPage };
}
