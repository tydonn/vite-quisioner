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
    await api.post("/logout")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("auth_roles")
    localStorage.removeItem("auth_program_code")
};
