
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Show a delete confirmation using window.confirm and toastify
 * @param {string} deleteText - ข้อความยืนยันการลบ
 * @param {string} successText - ข้อความแจ้งเตือนหลังลบสำเร็จ
 * @returns {Promise<boolean>} - true ถ้ากดยืนยัน, false ถ้ายกเลิก
 */
export const DeleteAlert = async (
  deleteText = "You won't be able to revert this!",
  successText = "Your file has been deleted."
) => {
  const isConfirmed = window.confirm(deleteText); 

  if (isConfirmed) {
    toast.success(successText, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
    fontFamily: "'Noto Sans Lao', sans-serif",
  },
    });
    return true; // click to confirm
  }

  return false; // click to cancel
};
