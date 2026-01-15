// utils/dateFilter.js

/**
 * Filter data by startDate and endDate
 * @param {Array} data - Array ของ object ที่มี field date
 * @param {Date|null} startDate - วันที่เริ่มต้น
 * @param {Date|null} endDate - วันที่สิ้นสุด
 * @param {string} field - key ที่เก็บ date ใน object (default = "date")
 * @returns {Array} filtered data
 */
export function filterByDateRange(data, startDate, endDate, field = "date") {
  return data.filter((item) => {
    const itemDate = new Date(item[field]);
    const matchStart = !startDate || itemDate >= startDate;
    const matchEnd = !endDate || itemDate <= endDate;
    return matchStart && matchEnd;
  });
}
