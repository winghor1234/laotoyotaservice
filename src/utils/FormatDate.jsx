// ฟังก์ชันแปลง dd/MM/yyyy -> yyyy-MM-dd
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  }
  return dateStr; // ถ้า format มันถูกอยู่แล้ว
}



export const formatDates = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return (
    String(d.getUTCDate()).padStart(2, "0") + "/" +
    String(d.getUTCMonth() + 1).padStart(2, "0") + "/" +
    d.getUTCFullYear()
  );
};
export const formatMultipleDatesString = (input) => {
  if (!input) return "";

  // case: array
  if (Array.isArray(input)) {
    return input
      .map((d) => new Date(d).toLocaleDateString("en-GB"))
      .join(", ");
  }

  const str = String(input);

  const matches = str.match(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g
  );

  if (!matches) {
    // fallback: try parse single date
    const d = new Date(str);
    if (!isNaN(d)) {
      return d.toLocaleDateString("en-GB");
    }
    return "";
  }

  return matches
    .map((d) => new Date(d).toLocaleDateString("en-GB"))
    .join(", ");
};