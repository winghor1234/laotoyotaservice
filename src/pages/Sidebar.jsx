import { useNavigate } from "react-router-dom";
import { Home, Users, Gift, Car, Settings, Clock, X, LogOutIcon, PinIcon, MapPin, ShieldUser } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";
import useToyotaStore from "../store/ToyotaStore";
import { LiaGiftsSolid } from "react-icons/lia";
import { FaPeopleArrows } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useCheckRole } from "../utils/checkRole";


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("headerSidebar");
  const role = useCheckRole();
  // console.log("User role:", role);


  const removeToken = useToyotaStore.getState().removeToken;

  const currentPath = location.pathname;
  const isBookingPath =
    currentPath.startsWith("/user/booking") ||
    currentPath.startsWith("/user/receiverCarDetail") ||
    currentPath.startsWith("/user/fixDetail") ||
    currentPath.startsWith("/user/cancelDetail") ||
    currentPath.startsWith("/user/successDetail");
  const isGiftPath = currentPath.startsWith("/user/gift");
  const isServicePath = currentPath.startsWith("/user/servicing") || currentPath.startsWith("/user/service-detail/");
  const isDashboardPath = currentPath.startsWith("/user/dashboard");
  const isPromotionPath = currentPath.startsWith("/user/promotion");
  const isBranchPath = currentPath.startsWith("/user/branch");
  const isCar = currentPath.startsWith("/user/car");
  const isTimePath = currentPath.startsWith("/user/time-zone");
  const isReportPath = currentPath.startsWith("/user/report");
  const isUserPath = currentPath.startsWith("/user/user");
  const isAdminPath = currentPath.startsWith("/user/admin");
  const isEmployeePath = currentPath.startsWith("/user/employee");

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  const SideBarItems = [
    { icon: <Home className="w-5 h-5" />, label: t("dashboard"), path: "/user/dashboard", isActive: isDashboardPath },
    { icon: <FaPeopleArrows className="w-5 h-5" />, label: t("appointment"), path: "/user/booking", isActive: isBookingPath },
    { icon: <Clock className="w-5 h-5" />, label: t("time_zone"), path: "/user/time-zone", isActive: isTimePath },
    { icon: <Gift className="w-5 h-5" />, label: t("promotion"), path: "/user/promotion", isActive: isPromotionPath },
    { icon: <LiaGiftsSolid className="w-5 h-5" />, label: t("reward"), path: "/user/gift", isActive: isGiftPath },
    { icon: <Car className="w-5 h-5" />, label: t("car_info"), path: "/user/car", isActive: isCar },
    { icon: <Users className="w-5 h-5" />, label: t("customer_info"), path: "/user/user", isActive: isUserPath },
    ...(role && role === "super_admin" ? [
      { icon: <MapPin className="w-5 h-5" />, label: t("branch_info"), path: "/user/branch", isActive: isBranchPath },
      { icon: <MdOutlineAdminPanelSettings className="w-5 h-5" />, label: t("admin_info"), path: "/user/admin", isActive: isAdminPath },
      { icon: <ShieldUser className="w-5 h-5" />, label: t("employee_info"), path: "/user/employee", isActive: isEmployeePath },
    ] : []),
    { icon: <Settings className="w-5 h-5" />, label: t("service"), path: "/user/servicing", isActive: isServicePath },
    { icon: <TbReportAnalytics className="w-5 h-5" />, label: t("report"), path: "/user/report", isActive: isReportPath },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
    fixed lg:relative
    top-0 left-0
    z-50
    w-[243px]
    h-screen
    bg-[#E52020] text-white
    flex flex-col
    transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
      >
        {/* Logo */}
        <div className="relative p-4 lg:p-6 flex justify-center">
          <img
            src={logo}
            alt="logo"
            className="w-[110px] h-[110px] rounded-full object-cover"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-2 right-2 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 w-full overflow-y-auto px-2 lg:px-4">
          {SideBarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
          w-full h-10 mb-2
          flex items-center gap-3
          px-3 rounded-lg
          transition
          ${item.isActive
                  ? "bg-white text-[#E52020]"
                  : "hover:bg-white hover:text-[#E52020]"
                }
        `}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full h-10 flex items-center gap-3 px-3 rounded-lg hover:bg-white hover:text-[#E52020]"
          >
            <LogOutIcon className="w-5 h-5" />
            <span className="text-sm">{t("logout")}</span>
          </button>
        </div>
      </div>

    </>
  );
};

export default Sidebar;
