// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// import APIPath from "../../../api/APIPath";
// import { useTranslation } from "react-i18next";
// import axiosInstance from "../../../utils/AxiosInstance";

// // Zod schema with proper validation
// const employeeSchema = () => z.object({
//     userId: z.string(),
//     branchId: z.string(),
//     employee_name: z.string(),
//     position: z.string(),
// });


// export const useAddEmployeeForm = ({ onClose, handleFetchEmployee }) => {
//     const [loading, setLoading] = useState(false);
//     const { t } = useTranslation("employee");
//     const [branches, setBranches] = useState([]);
//     const [user, setUser] = useState([]);
//     const form = useForm({
//         resolver: zodResolver(employeeSchema()),
//         defaultValues: {
//             userId: "",
//             branchId: "",
//             employee_name: "",
//             position: "",
//         }
//     });
//     const { register, handleSubmit, reset, formState: { errors } } = form;
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [branchRes, userRes] = await Promise.all([
//                     axiosInstance.get(APIPath.SELECT_ALL_BRANCH),
//                     axiosInstance.get(APIPath.SELECT_ALL_USER),
//                 ]);

//                 setBranches(branchRes?.data?.data || []);
//                 setUser(userRes?.data?.data || []);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };

//         fetchData();
//     }, []);
//     const onSubmit = async (data) => {
//         try {
//             setLoading(true);
//             await axiosInstance.post(APIPath.CREATE_EMPLOYEE, data);
//             handleFetchEmployee();
//             SuccessAlert(t("add_success"), 1500, "success");
//             reset();
//             onClose();
//         } catch (error) {
//             console.error("Create Employee failed:", error);
//             const errorMessage = error.response?.data?.message || t("add_failed");
//             SuccessAlert(errorMessage, 2000, "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { register, handleSubmit, formState: { errors }, loading, onSubmit, reset, branches, user};
// };


import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";

const employeeSchema = () => z.object({
    userId: z.string().min(1, "Required"),
    branchId: z.string().min(1, "Required"),
    employee_name: z.string().min(1, "Required"),
    position: z.string().min(1, "Required"),
});

export const useAddEmployeeForm = ({ onClose, handleFetchEmployee }) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation("employee");
    const [branches, setBranches] = useState([]);
    const [user, setUser] = useState([]);

    // --- Searchable Dropdown States ---
    const [userSearch, setUserSearch] = useState("");
    const [userShowDropdown, setUserShowDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const userDropdownRef = useRef(null);

    const [branchSearch, setBranchSearch] = useState("");
    const [branchShowDropdown, setBranchShowDropdown] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const branchDropdownRef = useRef(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(employeeSchema()),
        defaultValues: { userId: "", branchId: "", employee_name: "", position: "" }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [branchRes, userRes] = await Promise.all([
                    axiosInstance.get(APIPath.SELECT_ALL_BRANCH),
                    axiosInstance.get(APIPath.SELECT_ALL_USER),
                ]);
                setBranches(branchRes?.data?.data || []);
                setUser(userRes?.data?.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // ปิด Dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) setUserShowDropdown(false);
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target)) setBranchShowDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post(APIPath.CREATE_EMPLOYEE, data);
            handleFetchEmployee();
            SuccessAlert(t("add_success"), 1500, "success");

            // เคลียร์ค่าทั้งหมดหลังสำเร็จ
            reset();
            setUserSearch("");
            setBranchSearch("");
            setSelectedUser(null);
            setSelectedBranch(null);
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || t("add_failed");
            SuccessAlert(errorMessage, 2000, "error");
        } finally {
            setLoading(false);
        }
    };

    return {
        register, handleSubmit, errors, loading, onSubmit, reset, branches, user, setValue, watch,
        userSearch, setUserSearch, userShowDropdown, setUserShowDropdown, selectedUser, setSelectedUser, userDropdownRef,
        branchSearch, setBranchSearch, branchShowDropdown, setBranchShowDropdown, selectedBranch, setSelectedBranch, branchDropdownRef
    };
};