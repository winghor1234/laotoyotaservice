
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import laoProvinceDistrict from "../../laos_provinces_districts.json";

const UserSchema = (t) => z.object({
    username: z.string().min(1, { message: t("min_length_1"), }).max(30),
    phoneNumber: z.string().min(8, { message: t("phone_min_length"), }),
    province: z.string().min(1, { message: t("min_length_1"), }),
    district: z.string().min(1, { message: t("min_length_1"), }),
    village: z.string().min(1, { message: t("min_length_1"), }),
});

export const useAddUserForm = ({ handleFetch, onClose, }) => {
    const { t, i18n } = useTranslation("auth");
    const [loading, setLoading] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch, control, } = useForm({
        resolver: zodResolver(
            UserSchema(t)
        ),
        defaultValues: {
            username: "",
            phoneNumber: "",
            // password: "",
            province: "",
            district: "",
            village: "",
        },
    });

    // =====================================
    // Current Language
    // =====================================

    const currentLang = i18n.language === "en" ? "name_en" : "name_lao";

    // =====================================
    // Province Options
    // =====================================

    const provinceOptions = useMemo(() => {
        return laoProvinceDistrict.provinces.map(
            (province) => ({
                value: province[currentLang],
                label: province[currentLang],
                districts: province.districts,
            })
        );
    }, [currentLang]);

    // =====================================
    // District Options
    // =====================================

    const districtOptions =
        useMemo(() => {
            if (!selectedProvince) return [];
            return (
                selectedProvince?.districts?.map((district) => ({
                    value: district[currentLang],
                    label: district[currentLang],
                })
                ) || []
            );
        }, [selectedProvince, currentLang,]);

    // =====================================
    // Province Change
    // =====================================

    const handleProvinceChange = (selectedOption) => {
        setSelectedProvince(selectedOption);
        setSelectedDistrict(null);
        setValue("province", selectedOption?.value || "");
        setValue("district", "");
    };

    // =====================================
    // District Change
    // =====================================

    const handleDistrictChange = (selectedOption) => {
        setSelectedDistrict(selectedOption);
        setValue("district", selectedOption?.value || "");
    };

    // =====================================
    // Submit
    // =====================================

    const submitForm = async (data) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post(APIPath.REGISTER, data);
            const message = res.data.message == "Phone number already exists" ? t("phone_exist") : t("add_success");
            if (message == t("phone_exist")) { SuccessAlert(message, 1500, "warning") }
            else {
                SuccessAlert(message)
                handleFetch();
                onClose();
                reset();
                setSelectedProvince(null);
                setSelectedDistrict(null);
            }
        } catch (error) {
            console.error("Add User failed:", error);
            SuccessAlert(t("add_failed"), 1500, "error");
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        submitForm,
        loading,
        control,
        watch,
        provinceOptions,
        districtOptions,
        selectedProvince,
        selectedDistrict,
        handleProvinceChange,
        handleDistrictChange,
    };
};