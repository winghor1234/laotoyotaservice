export const generateBillId = () => {
    const now = new Date();

    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    
    // 1. เพิ่ม Milliseconds (3 หลัก) เพื่อแยกความต่างในระดับเสี้ยววินาที
    const ms = String(now.getMilliseconds()).padStart(3, "0");

    // 2. ขยายเลขสุ่มจาก 2 หลัก (10-99) เป็น 4 หลัก (1000-9999)
    const random = Math.floor(1000 + Math.random() * 9000);

    // ผลลัพธ์จะเป็น: YYMMDDHHMMSSmsRandom
    // ตัวอย่าง: 2606042022051234567
    return `${yy}${mm}${dd}${hh}${min}${ss}${ms}${random}`;
};