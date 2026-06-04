
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const EmployeeSchema = () => z.object({
    userId: z.string().min(1, "Required"),
    branchId: z.string().min(1, "Required"),
    employee_name: z.string().min(1, "Required"),
    position: z.string().min(1, "Required")
});

export const useEditEmployeeForm = ({ onClose, employee_id, handleFetchEmployee }) => {
    const { t } = useTranslation("employee");
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);
    const [user, setUser] = useState([]);

    // States สำหรับ Custom Dropdown
    const [userSearch, setUserSearch] = useState("");
    const [userShowDropdown, setUserShowDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const userDropdownRef = useRef(null);

    const [branchSearch, setBranchSearch] = useState("");
    const [branchShowDropdown, setBranchShowDropdown] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const branchDropdownRef = useRef(null);

    const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
        resolver: zodResolver(EmployeeSchema()),
        defaultValues: { userId: "", branchId: "", employee_name: "", position: "" }
    });

    // ดึงข้อมูลทั้งหมด
    useEffect(() => {
        if (!employee_id) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [employeeRes, branchRes, userRes] = await Promise.all([
                    axiosInstance.get(APIPath.SELECT_ONE_EMPLOYEE(employee_id)),
                    axiosInstance.get(APIPath.SELECT_ALL_BRANCH),
                    axiosInstance.get(APIPath.SELECT_ALL_USER),
                ]);

                const empData = employeeRes?.data?.data;
                const allBranches = branchRes?.data?.data || [];
                const allUsers = userRes?.data?.data || [];

                setBranches(allBranches);
                setUser(allUsers);

                if (empData) {
                    // ✅ 1. Reset Form Values
                    reset({
                        userId: empData.userId || "",
                        branchId: empData.branchId || "",
                        employee_name: empData.employee_name || "",
                        position: empData.position || "",
                    });

                    // ✅ 2. Map IDs to Search Strings (สำคัญมาก)
                    const foundUser = allUsers.find(u => u.user_id === empData.userId);
                    if (foundUser) {
                        setUserSearch(foundUser.username);
                        setSelectedUser(foundUser);
                    }

                    const foundBranch = allBranches.find(b => b.branch_id === empData.branchId);
                    if (foundBranch) {
                        setBranchSearch(foundBranch.branch_name);
                        setSelectedBranch(foundBranch);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [employee_id, reset]);

    // ปิด Dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) setUserShowDropdown(false);
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target)) setBranchShowDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const submitForm = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.put(APIPath.UPDATE_EMPLOYEE(employee_id), data);
            handleFetchEmployee();
            SuccessAlert(t("update_success"), 1500, "success");
            onClose();
        } catch (error) {
            console.error("Update Employee failed:", error);
            SuccessAlert(t("update_failed"), 2000, "error");
        } finally {
            setLoading(false);
        }
    };

    return {
        register, handleSubmit, formState: { errors }, loading, submitForm, watch, setValue,
        user, branches,
        userSearch, setUserSearch, userShowDropdown, setUserShowDropdown, selectedUser, setSelectedUser, userDropdownRef,
        branchSearch, setBranchSearch, branchShowDropdown, setBranchShowDropdown, selectedBranch, setSelectedBranch, branchDropdownRef
    };
};