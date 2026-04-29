import axios from "axios";

let isRedirectingToLogin = false
let authProbePromise: Promise<boolean> | null = null

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

async function probeSession(token: string): Promise<boolean> {
    if (authProbePromise) {
        return authProbePromise
    }

    const baseURL = import.meta.env.VITE_API_URL as string
    authProbePromise = axios
        .get(`${baseURL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
        .then(() => true)
        .catch(() => false)
        .finally(() => {
            authProbePromise = null
        })

    return authProbePromise
}

function redirectToLogin() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("auth_roles")
    localStorage.removeItem("auth_program_code")
    localStorage.removeItem("auth_program_name")

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

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status === 401) {
            const requestUrl = String(error.config?.url || "")
            const isAuthEntryRequest =
                requestUrl.includes("/login") ||
                requestUrl.includes("/sso/exchange")
            const isMeRequest = requestUrl.includes("/me")
            const token = localStorage.getItem("token")

            // Do not force redirect for auth entry endpoints;
            // caller should handle its own error UI.
            if (isAuthEntryRequest) {
                return Promise.reject(error)
            }

            // If /me itself is unauthorized (or no token), session is invalid.
            if (!token || isMeRequest) {
                redirectToLogin()
                return Promise.reject(error)
            }

            // Guard against false-positive 401 from non-auth endpoints:
            // verify session via /me before redirecting.
            const isSessionValid = await probeSession(token)
            if (!isSessionValid) {
                redirectToLogin()
            }
        }
        return Promise.reject(error)
    }
);

export default api;
