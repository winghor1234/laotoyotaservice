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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:mb-6 ">
            {ButtonItem.map((item) => (
                <button
                    key={item.path}
                    onClick={() => handleButtonClick(item.path)}
                    className={` flex items-center justify-center  w-full  border-2 border-[#727272]  rounded-md font-medium transition-all duration-200  h-12 sm:h-14 lg:h-16 cursor-pointer active:scale-95 
            ${item.isActive
                            ? "bg-red-600 text-white border-red-600 shadow-lg"
                            : "bg-white hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md"
                        }
          `}
                >
                    <span className="font-semibold text-xl sm:text-md whitespace-nowrap">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ServiceStatusButton;
