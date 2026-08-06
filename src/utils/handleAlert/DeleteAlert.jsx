import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DeleteAlert = async (
  deleteText = "You won't be able to revert this!",
  successText = "Your file has been deleted.",
  showSuccess = true
) => {
  const isConfirmed = window.confirm(deleteText);

  if (isConfirmed) {

    if (showSuccess) {
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
    }

    return true;
  }

  return false;
};