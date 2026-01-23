import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BookingStatusButton = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const { t } = useTranslation("booking");

    const handleButtonClick = (path) => {
        if (!path) {
            navigate(`/user/booking`);
        } else {
            navigate(`/user/booking/${path}`);
        }
    };

    const ApproveButton = [
        {
            key: "pending",
            path: "",
            isActive: currentPath === '/user/booking' || currentPath === '/user/booking/'
        },
        {
            key: "fixing",
            path: "fix",
            isActive: currentPath === '/user/booking/fix'
        },
        {
            key: "success",
            path: "success",
            isActive: currentPath === '/user/booking/success'
        },
        {
            key: "cancel",
            path: "cancel",
            isActive: currentPath === '/user/booking/cancel'
        }
    ];

    return (
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3">
            {ApproveButton.map((item, index) => (
                <button
                    key={index}
                    onClick={() => handleButtonClick(item.path)}
                    className={` flex items-center justify-center h-12 sm:h-14 lg:h-16 border-2 border-[#727272] rounded-md font-medium text-sm sm:text-base md:text-lg transition-all duration-200 cursor-pointer active:scale-95
        ${item.isActive
                            ? "bg-red-600 text-white border-red-600 shadow-lg"
                            : "bg-white hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md"
                        }
      `}
                >
                    <span className="font-semibold whitespace-nowrap">
                        {t(item.key)}
                    </span>
                </button>
            ))}
        </div>


    );
};

export default BookingStatusButton;
