import axios from "axios";

let isRedirectingToLogin = false

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// inject token kalau ada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")

            if (!isRedirectingToLogin) {
                isRedirectingToLogin = true

                // Use SPA navigation to avoid hard reload 404 on some deployments.
                const basePath = import.meta.env.BASE_URL || "/"
                const loginPath = new URL(basePath, window.location.origin).pathname

                if (window.location.pathname !== loginPath) {
                    window.history.replaceState(null, "", loginPath)
                    window.dispatchEvent(new PopStateEvent("popstate"))
                }

                setTimeout(() => {
                    isRedirectingToLogin = false
                }, 0)
            }
        }
        return Promise.reject(error)
    }
);

export default api;
