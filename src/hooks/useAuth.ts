import { useEffect, useState } from "react";
import api from "@/lib/api";

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/me")
            .then((res) => {
                setUser(res.data.user);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
}
