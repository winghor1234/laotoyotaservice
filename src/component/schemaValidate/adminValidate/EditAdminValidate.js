import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import laoProvinceDistrict from "../../laos_provinces_districts.json";

const schema = (t) =>
    z.object({
        username: z.string().min(1, t("min_length_1")),
        phoneNumber: z.string().min(8, t("phone_min_length")),
        village: z.string().min(2, t("min_length_1")),
        district: z.string().min(2, t("min_length_1")),
        province: z.string().min(2, t("min_length_1")),
        email: z.string().email(t("email_invalid")).optional().or(z.literal("")),
    });

export const useEditAdminForm = ({
    customerId,
    handleFetch,
    onClose,
}) => {
    const { t, i18n } = useTranslation("auth");

    const [loading, setLoading] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema(t)),
        defaultValues: {
            username: "",
            phoneNumber: "",
            province: "",
            district: "",
            village: "",
            email: "",
        },
    });

    // =====================================
    // Current Language
    // =====================================

    const currentLang =
        i18n.language === "en" ? "name_en" : "name_lao";

    // =====================================
    // Province Options
    // =====================================

    const provinceOptions = useMemo(() => {
        return laoProvinceDistrict.provinces.map((province) => ({
            value: province[currentLang],
            label: province[currentLang],
            districts: province.districts,
        }));
    }, [currentLang]);

    // =====================================
    // District Options
    // =====================================

    const districtOptions = useMemo(() => {
        if (!selectedProvince) return [];

        return (
            selectedProvince?.districts?.map((district) => ({
                value: district[currentLang],
                label: district[currentLang],
            })) || []
        );
    }, [selectedProvince, currentLang]);

    // =====================================
    // Fetch User
    // =====================================

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get(
                    APIPath.SELECT_ONE_USER(customerId)
                );

                const user = res?.data?.data;

                reset({
                    username: user?.username || "",
                    phoneNumber: user?.phoneNumber || "",
                    province: user?.province || "",
                    district: user?.district || "",
                    village: user?.village || "",
                    email: user?.email || "",
                });

                const province = provinceOptions.find(
                    (p) => p.value === user?.province
                );

                setSelectedProvince(province || null);

                if (province) {
                    const district = province.districts.find(
                        (d) => d[currentLang] === user?.district
                    );

                    if (district) {
                        setSelectedDistrict({
                            value: district[currentLang],
                            label: district[currentLang],
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (customerId) fetchUser();
    }, [customerId, reset, provinceOptions, currentLang]);

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

    const submitForm = async (formData) => {
        setLoading(true);

        try {
            const payload = {
                ...formData,
                email: formData.email === "" ? null : formData.email,
            };

            const res = await axiosInstance.put(APIPath.UPDATE_CUSTOMER(customerId), payload);
            const message = res.data.message == "Phone number already exists" ? t("phone_exist") : t("add_success");
            if (message == t("phone_exist")) { SuccessAlert(message, 1500, "warning") }
            else {
                SuccessAlert(t("update_success"));
                handleFetch();
                onClose();
            }
        } catch (error) {
            SuccessAlert(t("update_failed"), 1500, "error");
            console.error("Error updating user:", error);
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