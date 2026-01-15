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


