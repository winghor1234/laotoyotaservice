import { useEffect, useState } from "react";
import axiosInstance from "./AxiosInstance";
import useToyotaStore from "../store/ToyotaStore";
import APIPath from "../api/APIPath";


export const useEmployeeBranchId = () => {
    const userId = useToyotaStore((state) => state.userId);
    const [branchId, setBranchId] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchBranchId = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ALL_EMPLOYEE);
                const employees = res?.data?.data || [];

                const emp = employees.find(
                    (emp) => emp.userId === userId
                );

                if (!emp?.branchId) {
                    console.warn("branchId not found");
                    return;
                }

                setBranchId(emp.branchId);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBranchId();
    }, [userId]);

    return branchId;
};
