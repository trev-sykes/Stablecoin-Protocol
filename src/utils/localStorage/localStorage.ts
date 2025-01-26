export const getCachedData = (key: string) => {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
}
export const setCachedData = (key: string, data: any) => {
    localStorage.setItem(data, key);
}