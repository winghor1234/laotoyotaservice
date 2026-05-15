

import { useNavigate, Link, useLocation } from "react-router-dom";
import { ChevronRight, X, LogOutIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useToyotaStore from "../store/ToyotaStore";
import { useCheckRole } from "../utils/checkRole";
import logo from "../assets/logo.jpg";
import { getSidebarItems } from "../utils/SidebarItems";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { t } = useTranslation("headerSidebar");
  const role = useCheckRole();
  const items = getSidebarItems(t, role);

  const location = useLocation();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState({});
  const [activeParent, setActiveParent] = useState(null);
  const [activeChild, setActiveChild] = useState(null);

  const currentPath = location.pathname;
  const isPath = (path) => {
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const removeToken = useToyotaStore.getState().removeToken;

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  // ✅ sync active
  useEffect(() => {
    items.forEach((item) => {
      if (item.children) {
        const found = item.children.find((c) => isPath(c.path));
        if (found) {
          setActiveParent(item.id);
          setActiveChild(found.path);
          setOpenDropdown((prev) => ({
            ...prev,
            [item.id]: true,
          }));
        }
      } else if (item.path && isPath(item.path)) {
        setActiveParent(item.id);
        setActiveChild(null);
      }
    });
  }, [currentPath]);

  return (
    <div
      className={`fixed lg:relative top-0 left-0 z-50 w-[243px] h-screen bg-[#E52020] text-white flex flex-col transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Logo */}
      <div className="relative p-4 flex justify-center">
        <img src={logo} className="w-[110px] h-[110px] rounded-full" />
        <button onClick={() => setSidebarOpen(false)} className="absolute top-2 right-2 lg:hidden">
          <X size={22} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;

          const isActive =
            activeParent === item.id ||
            item.children?.some((c) => c.path === activeChild);

          if (item.children) {
            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    toggleDropdown(item.id);
                    setActiveParent(item.id);
                  }}
                  className={`w-full h-10 mb-2 flex items-center justify-between px-3 rounded-lg
                    ${isActive ? "bg-white text-[#E52020]" : "hover:bg-white hover:text-[#E52020]"}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-lg">{item.label}</span>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 transition ${openDropdown[item.id] ? "rotate-90" : ""}`}
                  />
                </button>

                {openDropdown[item.id] && (
                  <div className="ml-6">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;

                      return (
                        <Link
                          key={child.id}
                          to={child.path}
                          onClick={() => {
                            setSidebarOpen(false);
                            setActiveParent(item.id);
                            setActiveChild(child.path);
                          }}
                          className={`w-full h-10 mb-2 flex items-center gap-3 px-3 rounded-lg
                            ${activeChild === child.path
                              ? "bg-white text-[#E52020]"
                              : "hover:bg-white hover:text-[#E52020]"}`}
                        >
                          <ChildIcon className="w-5 h-5" />
                          <span className="text-lg">{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => {
                setSidebarOpen(false);
                setActiveParent(item.id);
                setActiveChild(null);
              }}
              className={`w-full h-10 mb-2 flex items-center gap-3 px-3 rounded-lg
                ${activeParent === item.id
                  ? "bg-white text-[#E52020]"
                  : "hover:bg-white hover:text-[#E52020]"}`}
            >
              <Icon className="w-5 h-5" />
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
  );
};

export default Sidebar;