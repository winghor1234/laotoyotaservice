export function FormatNumber(num) {
    return (num ?? 0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}