"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { apiRequest } from "./api";

interface AuthUser {
    id: string;
    cognitoSub: string;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    provider?: "email" | "google";
}

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    refresh: async () => {},
    logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchUser() {
        try {
            const data = await apiRequest<{ user: AuthUser }>("/auth/me");
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await apiRequest("/auth/logout", { method: "POST" });
        } finally {
            setUser(null);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider
        value={{
            user,
            loading,
            refresh: fetchUser,
            logout,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}