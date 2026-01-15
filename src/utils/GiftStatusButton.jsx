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
            label: t("gift_history"), 
            path: 'gift-history',
            isActive: currentPath === '/user/gift/gift-history',
        },
    ];

    return (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6 mb-4 sm:mb-6 lg:mb-8">
            {ButtonItems.map((item) => (
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
