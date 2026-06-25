import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const GiftStatusButton = () => {
    const { t } = useTranslation("gift"); // ใช้ namespace 'gift'
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();

    const handleButtonClick = (path) => {
        if (!path) {
            navigate('/user/gift');
        } else {
            navigate(`/user/gift/${path}`);
        }
    };

    const ButtonItems = [
        {
            label: t("gift_data"),
            path: '',
            isActive: currentPath === '/user/gift',
        },
        {
            label: t("gift_exchange_data"),
            path: 'exchange-gift',
            isActive: currentPath === '/user/gift/exchange-gift',
        },
        {
            label: t("gift_history_success"),
            path: 'gift-history',
            isActive: currentPath === '/user/gift/gift-history',
        },
        {
            label: t("gift_history_canceled"),
            path: 'gift-canceled-history',
            isActive: currentPath === '/user/gift/gift-canceled-history',
        },
    ];

    return (
        <div className=" grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 ">
            {ButtonItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => handleButtonClick(item.path)}
                    className={`flex items-center justify-center  w-full h-12 sm:h-14 lg:h-16 border-2 border-[#727272]   rounded-md font-medium transition-all duration-200  text-sm sm:text-base md:text-lg cursor-pointer active:scale-95 
            ${item.isActive ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'bg-white hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md'}
          `}
                >
                    <span className="font-semibold text-xl sm:text-md whitespace-nowrap">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default GiftStatusButton;
