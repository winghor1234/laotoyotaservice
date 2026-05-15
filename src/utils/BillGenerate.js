export const generateBillId = () => {

    const now = new Date();

    const yy =
        String(
            now.getFullYear()
        ).slice(-2);

    const mm =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const dd =
        String(
            now.getDate()
        ).padStart(2, "0");

    const random =
        Math.floor(
            10 + Math.random() * 90
        );

    return `${yy}${mm}${dd}${random}`;
};