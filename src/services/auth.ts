import axios from "axios";
import api from "../lib/api";

export interface LoginPayload {
    email: string;
    password: string;
}

export const login = async (data: LoginPayload) => {
    const res = await api.post("/login", data);
    return res.data;
};

export const logout = async () => {
    const token = localStorage.getItem("token")

    await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    localStorage.removeItem("token")
};
