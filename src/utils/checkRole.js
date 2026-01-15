import { useState, useEffect } from "react";
import axiosInstance from "./AxiosInstance";


export const useCheckRole = () => {
    const [role, setRole] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("/user/profile");
                if (res?.data?.data?.role) {
                    setRole(res.data.data.role);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return role;
};