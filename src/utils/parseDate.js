export const parseDate = (date) => {

    if (!date) return null;

    // ISO DATE
    if (
        typeof date === "string" &&
        date.includes("T")
    ) {

        const parsed =
            new Date(date);

        return isNaN(parsed)
            ? null
            : parsed;
    }

    // YYYY-MM-DD
    if (
        typeof date === "string" &&
        date.includes("-")
    ) {

        const parts =
            date.split("-");

        // check format
        if (parts[0].length === 4) {

            const [year, month, day] =
                parts;

            const parsed =
                new Date(
                    Number(year),
                    Number(month) - 1,
                    Number(day)
                );

            return isNaN(parsed)
                ? null
                : parsed;
        }
    }

    // DD/MM/YYYY
    if (
        typeof date === "string" &&
        date.includes("/")
    ) {

        const [day, month, year] =
            date.split("/");

        const parsed =
            new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );

        return isNaN(parsed)
            ? null
            : parsed;
    }

    // fallback
    const fallback =
        new Date(date);

    return isNaN(fallback)
        ? null
        : fallback;
};