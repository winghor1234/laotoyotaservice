import React, { createContext, useContext, useState, useEffect } from "react";

const PointContext = createContext();
export const PointProvider = ({ children }) => {
    // ค่าเริ่มต้น: 1,000,000 กีบ = 1 แต้ม
    const [pointSettings, setPointSettings] = useState(() => {
        // พยายามโหลดค่าจากเครื่อง (LocalStorage) ถ้ามี
        const saved = localStorage.getItem("point_settings");
        return saved ? JSON.parse(saved) : {
            labour_amount: 1000000,
            labour_point: 1,
            part_amount: 1000000,
            part_point: 1,
        };
    });

    // บันทึกลง LocalStorage ทุกครั้งที่ค่าเปลี่ยน (เพื่อให้ Refresh แล้วค่าไม่หาย)
    useEffect(() => {
        localStorage.setItem("point_settings", JSON.stringify(pointSettings));
    }, [pointSettings]);

    return (
        <PointContext.Provider value={{ pointSettings, setPointSettings }}>
            {children}
        </PointContext.Provider>
    );
};

export const usePoints = () => useContext(PointContext);