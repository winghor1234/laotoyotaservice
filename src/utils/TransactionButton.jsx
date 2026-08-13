import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TransactionButton = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const { t } = useTranslation("store");

    const handleButtonClick = (path) => {
        if (!path) {
            navigate(`/user/transaction`);
        } else {
            navigate(`/user/transaction/${path}`);
        }
    };

    const ApproveButton = [
        {
            key: t("store"),
            path: "",
            isActive: currentPath === '/user/transaction' || currentPath === '/user/transaction/'
        },
        {
            key: t("fix"),
            path: "fix",
            isActive: currentPath === '/user/transaction/fix'
        },
        {
            key: t("workshop"),
            path: "workshop",
            isActive: currentPath === '/user/transaction/workshop'
        },

    ];

    return (
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
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
                    <span className="font-semibold text-xl sm:text-md whitespace-nowrap">
                        {t(item.key)}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default TransactionButton;
