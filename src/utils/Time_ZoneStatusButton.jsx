import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Time_ZoneStatusButton = () => {
    const { t } = useTranslation("timeZone");
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();

    const handleButtonClick = (path) => {
        if (!path) {
            navigate('/user/time-zone');
        } else {
            navigate(`/user/time-zone/${path}`);
        }
    };

    const ButtonItems = [
        {
            label: t("timeLabel"),  // ເວລາ
            path: '',
            isActive: currentPath === '/user/time-zone',
        },
        {
            label: t("zoneLabel"),  // ໂຊນ
            path: 'zone',
            isActive: currentPath === '/user/time-zone/zone',
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
                        h-10 sm:h-12 md:h-12 lg:h-14 xl:h-16
                        border-2 border-[#727272] 
                        px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 
                        py-2 sm:py-2 md:py-3 lg:py-4
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

export default Time_ZoneStatusButton;
