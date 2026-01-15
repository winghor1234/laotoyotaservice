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
    <div className=" flex  bg-[#E2E8F0] relative overflow-auto ">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 p-2 lg:p-4 overflow-auto scroll-hide">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Layout;