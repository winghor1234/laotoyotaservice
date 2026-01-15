// utils/filterSearch.js

/**
 * Filter และจัดลำดับรายการ
 * item ที่ match ทั้งหมด → ข้างบน
 * item ที่มีบางตัวอักษรตรงกับ query → ตามมา
 * item อื่น ๆ → ข้างล่าง
 */
export const filterSearch = (items, key, query) => {
  if (!query) return items;

  const lowerQuery = query.toLowerCase();

  return [...items].sort((a, b) => {
    const aValue = (a[key] ?? "").toString().toLowerCase();
    const bValue = (b[key] ?? "").toString().toLowerCase();

    const aMatch = aValue.includes(lowerQuery);
    const bMatch = bValue.includes(lowerQuery);

    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;

    // ถ้าไม่ตรงทั้งหมด แต่มีบางตัวอักษรตรง
    const countMatchChars = (str) =>
      [...lowerQuery].reduce((count, char) => (str.includes(char) ? count + 1 : count), 0);

    const aCharCount = countMatchChars(aValue);
    const bCharCount = countMatchChars(bValue);

    return bCharCount - aCharCount; // มาก → ข้างบน
  });
};
