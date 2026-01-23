import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../pages/Sidebar';
import Header from '../pages/Header';
import useToyotaStore from '../store/ToyotaStore';
import { useNavigate } from 'react-router-dom';


const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = useToyotaStore((state) => state.getToken());


  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);



  return (
    <div className="flex h-screen bg-[#E2E8F0] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Right side */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header (ไม่ scroll) */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content ที่ scroll ได้ */}
        <main className="flex-1 overflow-y-auto p-2 lg:p-4 scroll-hide">
          <Outlet />
        </main>
      </div>
    </div>

  );
};

export default Layout;