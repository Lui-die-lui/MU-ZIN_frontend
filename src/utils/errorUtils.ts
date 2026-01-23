
export function getErrorMessage (e: unknown, fallback = "문제가 발생했습니다.") {
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;
    return fallback;
}