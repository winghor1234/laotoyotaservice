// utils/helpers.js
export const formatCardNumber = (maxNumber = 0) => {
    // มั่นใจว่าเป็น Number ก่อนบวก
    const nextNumber = Number(maxNumber) + 1;
    
    // แปลงเป็น String และเติม 0 ข้างหน้าให้ครบ 4 หลัก (e.g., 2 -> "0002")
    const paddedNumber = nextNumber.toString().padStart(4, '0');
    
    return `VLTS${paddedNumber}`;
};