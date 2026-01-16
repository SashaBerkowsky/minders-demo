export type ErrorKey = "clientError" | "serverError" | "connectivityError" | "unexpectedError";

const errorMsg: Record<ErrorKey, string> = {
    clientError: "Please check your input and try again.",
    serverError: "Server issue. Please try again later.",
    connectivityError: "No internet connection. Check your connection and retry.",
    unexpectedError: "Something went wrong. Please try again.",
}

export const getErrorMessageKey = (
    error: any
): ErrorKey => {
    if (error.message.startsWith("CLIENT_ERROR:")) {
        return "clientError";
    } else if (error.message.startsWith("SERVER_ERROR:")) {
        return "serverError";
    } else if (
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("Failed to fetch")
    ) {
        return "connectivityError";
    }
    return "unexpectedError";
}

export const getErrorMessage = (key: ErrorKey): string => errorMsg[key]

