import { Bell, Globe, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import LanguageToggle from '../utils/LanguageToggle';
import axiosInstance from '../utils/AxiosInstance';
import APIPath from '../api/APIPath';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [profile, setProfile] = useState(null);
  const [booking, setBooking] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const { t } = useTranslation("headerSidebar");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [profileRes, bookingRes] = await Promise.all([
        axiosInstance.get(APIPath.GET_PROFILE),
        axiosInstance.get(APIPath.SELECT_ALL_BOOKING),
      ]);
      setProfile(profileRes?.data?.data);
      setBooking(bookingRes?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileDetail = () => {
    navigate("/user/profile");
  };

  const unreadCount = booking.filter((item) => item.bookingStatus === "await").length;

  return (
    <header className="bg-white w-full shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 h-16 sm:h-18 md:h-20">

        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#E52020] hover:text-[#c41e1e] transition p-1"
          >
            <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold truncate">
            {t("dashboard")}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <LanguageToggle />

          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-xs px-2 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                {unreadCount === 0 ? (
                  <p className="p-4 text-sm text-gray-500">{t("no_notifications")}</p>
                ) : (
                  booking
                    .filter(b => b.bookingStatus === "await")
                    .map(note => (
                      <div
                        key={note.booking_id}
                        className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(`/user/receiverCarDetail/${note.booking_id}`);
                          setShowNotifications(false);
                        }}
                      >
                        {note.user?.username} - {note.car?.model}
                      </div>
                    ))
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          {profile && (
            <div onClick={handleProfileDetail} className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-red-500 overflow-hidden flex items-center justify-center">
                {profile.profile ? (
                  <img src={profile.profile} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-white">{t("no_image")}</span>
                )}
              </div>
              <span className="hidden sm:block">{profile.username}</span>
            </div>
          )}
        </div>
      </div>
    </header>

  );
};

export default Header;
