import { useNavigate } from "react-router-dom";
import {
  Home, Users, Gift, Car, Settings, Clock, X, LogOutIcon,
  MapPin, ShieldUser, MapPinHouse, CalendarCog, MapPinPlus,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";
import useToyotaStore from "../store/ToyotaStore";
import { LiaGiftsSolid } from "react-icons/lia";
import { FaPeopleArrows } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useCheckRole } from "../utils/checkRole";
import { useState, useEffect } from "react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("headerSidebar");
  const role = useCheckRole();

  const [openDropdown, setOpenDropdown] = useState({});
  const [activeParent, setActiveParent] = useState(null);
  const [activeChild, setActiveChild] = useState(null);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const removeToken = useToyotaStore.getState().removeToken;

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  const currentPath = location.pathname;

  const isPath = (path) => currentPath.startsWith(path);

  const SideBarItems = [
    { icon: <Home className="w-5 h-5" />, label: t("dashboard"), path: "/user/dashboard" },
    { icon: <FaPeopleArrows className="w-5 h-5" />, label: t("appointment"), path: "/user/booking" },

    {
      icon: <CalendarCog className="w-5 h-5" />,
      label: t("zone_time_management"),
      children: [
        { icon: <Clock className="w-5 h-5" />, label: t("time"), path: "/user/time" },
        { icon: <MapPinHouse className="w-5 h-5" />, label: t("zone"), path: "/user/zone" },
        { icon: <MapPinPlus className="w-5 h-5" />, label: t("time_zone"), path: "/user/time-fix" },
      ],
    },

    { icon: <Gift className="w-5 h-5" />, label: t("promotion"), path: "/user/promotion" },
    { icon: <LiaGiftsSolid className="w-5 h-5" />, label: t("reward"), path: "/user/gift" },

    {
      icon: <Settings className="w-5 h-5" />,
      label: t("general_management"),
      children: [
        { icon: <Car className="w-5 h-5" />, label: t("car_info"), path: "/user/car" },
        { icon: <Users className="w-5 h-5" />, label: t("customer_info"), path: "/user/user" },
        ...(role === "super_admin"
          ? [{ icon: <MapPin className="w-5 h-5" />, label: t("branch_info"), path: "/user/branch" }]
          : []),
      ],
    },

    ...(role === "super_admin"
      ? [
        {
          icon: <MdOutlineAdminPanelSettings className="w-5 h-5" />,
          label: t("backend_management"),
          children: [
            { icon: <MdOutlineAdminPanelSettings className="w-5 h-5" />, label: t("admin_info"), path: "/user/admin" },
            { icon: <ShieldUser className="w-5 h-5" />, label: t("employee_info"), path: "/user/employee" },
          ],
        },
      ]
      : []),

    { icon: <Settings className="w-5 h-5" />, label: t("service"), path: "/user/servicing" },
    { icon: <TbReportAnalytics className="w-5 h-5" />, label: t("report"), path: "/user/report" },
  ];

  // ✅ sync active กับ URL (refresh ก็ยังแดง)
  useEffect(() => {
    SideBarItems.forEach((item) => {
      if (item.children) {
        const found = item.children.find((child) =>
          isPath(child.path)
        );
        if (found) {
          setActiveParent(item.label);
          setActiveChild(found.path);
          setOpenDropdown((prev) => ({
            ...prev,
            [item.label]: true,
          }));
        }
      } else if (item.path && isPath(item.path)) {
        setActiveParent(item.label);
        setActiveChild(null);
      }
    });
  }, [currentPath]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:relative top-0 left-0 z-50 w-[243px] h-screen bg-[#E52020] text-white flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >

        {/* Logo */}
        <div className="relative p-4 lg:p-6 flex justify-center">
          <img src={logo} className="w-[110px] h-[110px] rounded-full object-cover" />
          <button onClick={() => setSidebarOpen(false)} className="absolute top-2 right-2 lg:hidden">
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 w-full overflow-y-auto px-2 ">
          {SideBarItems.map((item, index) => {

            const isParentActive =
              activeParent === item.label ||
              item.children?.some(child => child.path === activeChild);

            if (item.children) {
              return (
                <div key={index}>
                  <button
                    onClick={() => {
                      toggleDropdown(item.label);
                      setActiveParent(item.label);
                      setActiveChild(null);
                    }}
                    className={`w-full h-10 mb-2 flex items-center justify-between px-3 duration-200 rounded-lg transition
                      ${isParentActive
                        ? "bg-white text-[#E52020]"
                        : "hover:bg-white hover:text-[#E52020]"}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-lg">{item.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform duration-300 ${openDropdown[item.label] ? "rotate-90" : ""}`}
                    />
                  </button>

                  {openDropdown[item.label] && (
                    <div className="ml-6">
                      {item.children.map((child, i) => (
                        <Link
                          key={i}
                          to={child.path}
                          onClick={() => {
                            setSidebarOpen(false);
                            setActiveParent(item.label);
                            setActiveChild(child.path);
                          }}
                          className={`w-full h-10 mb-2 flex items-center gap-3 px-3 rounded-lg transition
                            ${activeChild === child.path
                              ? "bg-white text-[#E52020]"
                              : "hover:bg-white hover:text-[#E52020]"}
                          `}
                        >
                          {child.icon}
                          <span className="text-lg">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => {
                  setSidebarOpen(false);
                  setActiveParent(item.label);
                  setActiveChild(null);
                }}
                className={`w-full h-10 mb-2 flex items-center gap-3 px-3 rounded-lg transition
                  ${activeParent === item.label
                    ? "bg-white text-[#E52020]"
                    : "hover:bg-white hover:text-[#E52020]"}
                `}
              >
                {item.icon}
                <span className="text-lg">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full h-10 flex items-center gap-3 px-3 rounded-lg hover:bg-white hover:text-[#E52020]"
          >
            <LogOutIcon className="w-5 h-5" />
            <span className="text-lg">{t("logout")}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;