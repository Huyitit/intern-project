import { toast } from "react-toastify";

let logoutFunction: (() => void) | null = null;

export function registerLogout(
    logout: () => void
) {
    logoutFunction = logout;
}

export async function apiFetch(url: string, options?: RequestInit) {

    const response = await fetch(url, options);

    if (response.status === 403) {

        toast.error(
            "Session expired"
        );

        logoutFunction?.();

        throw new Error("Unauthorized");

    }
    return response;
}