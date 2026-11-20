
import { randomInt } from "crypto";

export const generateInvoiceCode = (date = new Date()) => {
    const prefix = "ARV";
    const companyCode = "LTS";

    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // Random number 00001 - 99999
    const runningNumber = String(randomInt(1, 100000)).padStart(5, "0");

    return `${prefix}-${companyCode}-${year}${month}-${runningNumber}`;
};
