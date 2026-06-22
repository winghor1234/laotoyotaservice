export const toSafeString = (value) => {
    if (value === null || value === undefined) return "";
    return String(value).trim();
};

export const toSafeInt = (value) => {
    if (value === null || value === undefined || value === "") {
        return 0;
    }

    const parsed = parseInt(value, 10);

    return Number.isNaN(parsed) ? 0 : parsed;
};