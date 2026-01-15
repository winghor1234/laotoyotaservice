import { ToastContainer } from "react-toastify";
import Router from "./route/Router";
import { useEffect } from "react";
import useToyotaStore from "./store/ToyotaStore";
import i18n from "./i18n";

const App = () => {
  useEffect(() => {
    // ตรวจสอบ token
    const tokenExpire = useToyotaStore.getState().getTokenExpire();
    if (tokenExpire && Date.now() > tokenExpire) {
      useToyotaStore.getState().removeToken();
    }

    // ตั้งค่าภาษาเริ่มต้นจาก localStorage
    const savedLang = localStorage.getItem("appLang");
    if (savedLang) i18n.changeLanguage(savedLang);
  }, []);

  return (
    <div>
      <ToastContainer />
      <Router />
    </div>
  );
};

export default App;
