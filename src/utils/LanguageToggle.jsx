import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import i18n, { setLanguage } from "../i18n";

const LanguageToggle = () => {
    const [lang, setLang] = useState(i18n.language || "lo");

    useEffect(() => {
        const savedLang = localStorage.getItem("appLang");
        if (savedLang) {
            setLang(savedLang);
            i18n.changeLanguage(savedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === "lo" ? "en" : "lo";
        setLang(newLang);
        setLanguage(newLang);
    };

    return (
        <div className="flex justify-center ">
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-2 py-1 rounded-xl bg-gradient-to-r bg-red-500  text-white hover:bg-red-600 font-semibold  hover:opacity-90 transition shadow-lg cursor-pointer">
                <Globe className="w-5 h-5" />
                {lang === "lo" ? "ພາສາລາວ" : "English"}
            </button>
        </div>
    );
};

export default LanguageToggle;
