const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

async function refreshSession() {
    const response = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    return response.ok;
}

export async function apiRequest<T = unknown>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const requestOptions: RequestInit = {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    };

    let response = await fetch(`${BASE}${path}`, requestOptions);

    if (response.status === 401 && path !== "/auth/refresh") {
        const refreshed = await refreshSession();

        if (refreshed) {
            response = await fetch(`${BASE}${path}`, requestOptions);
        }
    }

    if (!response.ok) {
        const body = await response.json().catch(() => ({ message: "Request failed" }));
        throw new Error(body.message ?? body.error ?? `HTTP ${response.status}`)
    }

    return response.json() as Promise<T>
}

export async function apiUpload<T = unknown>(
    path: string,
    formData: FormData,
    options?: RequestInit
): Promise<T> {
    const requestOptions: RequestInit = {
        method: "POST",
        ...options,
        credentials: "include",
        body: formData,
    };

    let response = await fetch(`${BASE}${path}`, requestOptions);

    if (response.status === 401) {
        const refreshed = await refreshSession();

        if (refreshed) {
            response = await fetch(`${BASE}${path}`, requestOptions);
        }
    }

    if (!response.ok) {
        const body = await response
            .json()
            .catch(() => ({ message: "Upload failed" }));

        throw new Error(body.message ?? body.error ?? `HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
}

/*
- ใช้ NEXT_PUBLIC_API_URL
- ส่ง credentials: "include"
- parse error message
- มี apiRequest สำหรับ JSON
- มี apiUpload สำหรับ FormData
*/