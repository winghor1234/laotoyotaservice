import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// auth
import authEn from "./locales/en/authTranslation.json";
import authLo from "./locales/lo/authTranslation.json";

// booking
import bookingEn from "./locales/en/bookingTranslate.json";
import bookingLo from "./locales/lo/bookingTranslate.json";

// car
import carEn from "./locales/en/carTranslate.json";
import carLo from "./locales/lo/carTranslate.json";

// dashboard 
import dashboardEn from "./locales/en/dashboardTranslate.json";
import dashboardLo from "./locales/lo/dashboardTranslate.json";

// gift
import giftEn from "./locales/en/giftTranslate.json";
import giftLo from "./locales/lo/giftTranslate.json";

// promotion
import promotionEn from "./locales/en/promotionTranslate.json";
import promotionLo from "./locales/lo/promotionTranslate.json";

// report
import reportEn from "./locales/en/reportTranslate.json";
import reportLo from "./locales/lo/reportTranslate.json";

// service
import serviceEn from "./locales/en/serviceTranslate.json";
import serviceLo from "./locales/lo/serviceTranslate.json";

// time and zone
import timeZoneEn from "./locales/en/timeZoneTranslate.json";
import timeZoneLo from "./locales/lo/timeZoneTranslate.json";

// user
import userEn from "./locales/en/userTranslate.json";
import userLo from "./locales/lo/userTranslate.json";

// Header and Sidebar
import headerSidebarEn from "./locales/en/headerSidebarTranslate.json";
import headerSidebarLo from "./locales/lo/headerSidebarTranslate.json";

// utils
import utilEn from "./locales/en/utilTranslate.json";
import utilLo from "./locales/lo/utilTranslate.json";

// branch
import branchEn from "./locales/en/branchTranslation.json";
import branchLo from "./locales/lo/branchTranslate.json";

// employee
import employeeEn from "./locales/en/employeeTranslate.json";
import employeeLo from "./locales/lo/employeeTranslate.json";


// โหลดค่าภาษาเก่าจาก localStorage
const savedLang = localStorage.getItem("appLang") || "lo";

i18n.use(initReactI18next).init({
    resources: {
        en: { auth: authEn, booking: bookingEn, car: carEn, dashboard: dashboardEn, gift: giftEn, promotion: promotionEn, report: reportEn, service: serviceEn, timeZone: timeZoneEn, user: userEn, headerSidebar: headerSidebarEn, util: utilEn, branch: branchEn, employee: employeeEn },
        lo: { auth: authLo, booking: bookingLo, car: carLo, dashboard: dashboardLo, gift: giftLo, promotion: promotionLo, report: reportLo, service: serviceLo, timeZone: timeZoneLo, user: userLo, headerSidebar: headerSidebarLo, util: utilLo, branch: branchLo, employee: employeeLo },
    },
    lng: savedLang, // default จาก localStorage
    fallbackLng: "lo",
    ns: ["auth", "booking", "car","dashboard", "gift", "promotion", "report", "service", "timeZone","user","headerSidebar","util","branch","employee"], // ระบุ namespace
    defaultNS: "auth",       // namespace default
    interpolation: { escapeValue: false },
});

export const setLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("appLang", lng);
};

export default i18n;
