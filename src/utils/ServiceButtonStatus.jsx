import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ServiceStatusButton = () => {
    const { t } = useTranslation("service");
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();

    const handleButtonClick = (path) => {
        if (!path) {
            navigate(`/user/servicing`); // index route
        } else {
            navigate(`/user/servicing/${path}`);
        }
    };

    const ButtonItem = [
        {
            label: t("buttons.service_info"),
            path: "",
            isActive: currentPath === "/user/servicing"
        },
        {
            label: t("buttons.history"),
            path: "service-history",
            isActive: currentPath.includes("/service-history")
        }
    ];

    return (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6 mb-2 sm:mb-4 lg:mb-4">
            {ButtonItem.map((item) => (
                <button
                    key={item.path}
                    onClick={() => handleButtonClick(item.path)}
                    className={`
            flex-1 flex items-center justify-center 
            w-full sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px] xl:min-w-[200px]
            h-12 sm:h-13 md:h-14 lg:h-16 xl:h-18
            border-2 border-[#727272] 
            px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 
            py-3 sm:py-2 md:py-3 lg:py-4
            rounded-md font-medium transition-all duration-200 
            text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl
            cursor-pointer active:scale-95 touch-manipulation
            ${item.isActive
                            ? "bg-red-600 text-white border-red-600 shadow-lg"
                            : "bg-white hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md"
                        }
          `}
                >
                    <span className="font-bold text-xl sm:text-md whitespace-nowrap">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ServiceStatusButton;
