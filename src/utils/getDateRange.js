// utils/getDateRange.js

export const getDateRange = (type) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let startDate, endDate;

    switch (type) {
        case "today":
            startDate = today;
            endDate = today;
            break;

        case "yesterday":
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 1);
            endDate = startDate;
            break;

        case "thisWeek":
            startDate = new Date(today);
            startDate.setDate(today.getDate() - today.getDay());
            endDate = today;
            break;

        case "lastWeek":
            startDate = new Date(today);
            startDate.setDate(today.getDate() - today.getDay() - 7);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            break;

        case "thisYear":
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = today;
            break;

        case "lastYear":
            startDate = new Date(today.getFullYear() - 1, 0, 1);
            endDate = new Date(today.getFullYear() - 1, 11, 31);
            break;

        default:
            return null;
    }

    return { startDate, endDate };
};