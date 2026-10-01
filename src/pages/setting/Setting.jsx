import { useEffect, useRef, useState } from "react";
import {
    Building2,
    Camera,
    Save,
    MapPin,
    Phone,
    Mail,
    Globe,
    Image as ImageIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";

const settingSchema = z.object({
    name: z
        .string()
        .min(1, "Service name is required"),

    address: z
        .string()
        .min(1, "Address is required"),

    phone: z
        .string()
        .min(1, "Phone is required"),

    email: z
        .string()
        .email("Invalid email address")
        .or(z.literal("")),
    latitude: z
        .string()
        .optional(),

    longitude: z
        .string()
        .optional(),

    website: z
        .string()
        .url("Invalid website URL")
        .or(z.literal("")),
});

const Setting = () => {
    const { t } = useTranslation("setting");

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [setting, setSetting] = useState(null);

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(settingSchema),
        defaultValues: {
            name: "",
            address: "",
            phone: "",
            email: "",
            latitude: "",
            longitude: "",
            website: "",
        },
    });

    useEffect(() => {
        fetchSetting();
    }, []);

    const fetchSetting = async () => {
        try {
            setLoading(true);

            const res = await axiosInstance.get(
                APIPath.SELECT_SETTING
            );

            const data = res?.data?.data;

            if (!data) {
                setSetting(null);

                reset({
                    name: data.name || "",
                    address: data.address || "",
                    latitude:
                        data.latitude !== null && data.latitude !== undefined
                            ? String(data.latitude)
                            : "",
                    longitude:
                        data.longitude !== null && data.longitude !== undefined
                            ? String(data.longitude)
                            : "",
                    phone: data.phone || "",
                    email: data.email || "",
                    website: data.website || "",
                });

                setLogoPreview("");

                return;
            }

            setSetting(data);

            reset({
                name: data.name || "",
                address: data.address || "",
                phone: data.phone || "",
                email: data.email || "",
                website: data.website || "",
            });

            setLogoPreview(data.logo || "");

        } catch (error) {
            console.error("Error loading setting:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB.");
            return;
        }

        setLogoFile(file);

        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
    };

    const handleChooseLogo = () => {
        fileInputRef.current?.click();
    };

    const latitude = watch("latitude");
    const longitude = watch("longitude");

    const openGoogleMaps = () => {
        if (!latitude || !longitude) {
            window.open(
                "https://www.google.com/maps",
                "_blank",
                "noopener,noreferrer"
            );

            return;
        }

        const url =
            `https://www.google.com/maps/search/?api=1` +
            `&query=${encodeURIComponent(
                `${latitude},${longitude}`
            )}`;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const onSubmit = async (formData) => {
        try {
            setSaving(true);

            const data = new FormData();

            data.append("name", formData.name);
            data.append("address", formData.address);
            data.append("phone", formData.phone);
            data.append("email", formData.email || "");
            data.append("website", formData.website || "");

            if (logoFile) {
                data.append("logo", logoFile);
            }

            let res;

            // ========================================
            // INSERT
            // ========================================
            if (!setting) {
                res = await axiosInstance.post(
                    APIPath.CREATE_SETTING,
                    data
                );
            }

            // ========================================
            // UPDATE
            // ========================================
            else {
                res = await axiosInstance.put(
                    APIPath.UPDATE_SETTING,
                    data
                );
            }

            const updatedData = res?.data?.data;

            if (updatedData) {
                setSetting(updatedData);

                reset({
                    name: updatedData.name || "",
                    address: updatedData.address || "",
                    phone: updatedData.phone || "",
                    email: updatedData.email || "",
                    website: updatedData.website || "",
                });

                setLogoPreview(updatedData.logo || "");
                setLogoFile(null);
            }

            alert(
                setting
                    ? "Setting updated successfully."
                    : "Setting created successfully."
            );

        } catch (error) {
            console.error(
                "Error saving setting:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Failed to save setting."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Spinner
                    size="5"
                    color="red"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-4xl mx-auto">

                {/* Back */}
                <div className="mb-4">
                    <BackButton />
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">

                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <Building2
                                    size={22}
                                    className="text-[#E52020]"
                                />
                            </div>

                            <div>
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                                    {t("setting") || "Setting"}
                                </h1>

                                <p className="text-sm text-gray-500 mt-1">
                                    {t("setting_description") ||
                                        "Manage Laos Toyota Service information"}
                                </p>
                            </div>

                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="p-4 sm:p-6">

                            {/* Logo */}
                            <div className="mb-8">

                                <h2 className="text-base font-semibold text-gray-800 mb-4">
                                    {t("logo") || "Logo"}
                                </h2>

                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                                    {/* Logo Preview */}
                                    <div className="relative">

                                        <div className="w-36 h-36 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">

                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Laos Toyota Service Logo"
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <ImageIcon
                                                    size={48}
                                                    className="text-gray-300"
                                                />
                                            )}

                                        </div>

                                        {/* Camera */}
                                        <button
                                            type="button"
                                            onClick={handleChooseLogo}
                                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#E52020] text-white flex items-center justify-center shadow-md hover:bg-red-700 transition cursor-pointer"
                                        >
                                            <Camera size={18} />
                                        </button>

                                    </div>

                                    {/* Logo Actions */}
                                    <div className="flex flex-col items-center sm:items-start gap-2">

                                        <button
                                            type="button"
                                            onClick={handleChooseLogo}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#E52020] hover:bg-red-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                                        >
                                            <Camera size={17} />

                                            {t("change_logo") ||
                                                "Change Logo"}
                                        </button>

                                        <p className="text-xs text-gray-400 text-center sm:text-left">
                                            JPG, JPEG, PNG
                                            <br />
                                            Maximum 5MB
                                        </p>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />

                                    </div>

                                </div>
                            </div>

                            {/* Service Information */}
                            <div>

                                <h2 className="text-base font-semibold text-gray-800 mb-4">
                                    {t("service_information") ||
                                        "Service Information"}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Name */}
                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t("name") ||
                                                "Service Name"}
                                        </label>

                                        <div className="relative">

                                            <Building2
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                {...register("name")}
                                                placeholder="Laos Toyota Service"
                                                className={`w-full h-11 pl-10 pr-3 border rounded-lg outline-none transition
                                                    ${errors.name
                                                        ? "border-red-500"
                                                        : "border-gray-300 focus:border-[#E52020] focus:ring-1 focus:ring-[#E52020]"
                                                    }
                                                `}
                                            />

                                        </div>

                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.name.message}
                                            </p>
                                        )}

                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t("address") ||
                                                "Address"}
                                        </label>

                                        <div className="relative">

                                            <MapPin
                                                size={18}
                                                className="absolute left-3 top-3 text-gray-400"
                                            />

                                            <textarea
                                                {...register("address")}
                                                rows={3}
                                                placeholder="Vientiane, Laos"
                                                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg outline-none transition resize-none
                                                    ${errors.address
                                                        ? "border-red-500"
                                                        : "border-gray-300 focus:border-[#E52020] focus:ring-1 focus:ring-[#E52020]"
                                                    }
                                                `}
                                            />

                                        </div>

                                        {errors.address && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.address.message}
                                            </p>
                                        )}

                                    </div>

                                    {/* Phone */}
                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t("phone") ||
                                                "Phone"}
                                        </label>

                                        <div className="relative">

                                            <Phone
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                {...register("phone")}
                                                placeholder="020 xxxx xxxx"
                                                className={`w-full h-11 pl-10 pr-3 border rounded-lg outline-none transition
                                                    ${errors.phone
                                                        ? "border-red-500"
                                                        : "border-gray-300 focus:border-[#E52020] focus:ring-1 focus:ring-[#E52020]"
                                                    }
                                                `}
                                            />

                                        </div>

                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.phone.message}
                                            </p>
                                        )}

                                    </div>

                                    {/* Email */}
                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t("email") ||
                                                "Email"}
                                        </label>

                                        <div className="relative">

                                            <Mail
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="email"
                                                {...register("email")}
                                                placeholder="example@email.com"
                                                className={`w-full h-11 pl-10 pr-3 border rounded-lg outline-none transition
                                                    ${errors.email
                                                        ? "border-red-500"
                                                        : "border-gray-300 focus:border-[#E52020] focus:ring-1 focus:ring-[#E52020]"
                                                    }
                                                `}
                                            />

                                        </div>

                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}

                                    </div>

                                    {/* Website */}
                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t("website") ||
                                                "Website"}
                                        </label>

                                        <div className="relative">

                                            <Globe
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                {...register("website")}
                                                placeholder="https://example.com"
                                                className={`w-full h-11 pl-10 pr-3 border rounded-lg outline-none transition
                                                    ${errors.website
                                                        ? "border-red-500"
                                                        : "border-gray-300 focus:border-[#E52020] focus:ring-1 focus:ring-[#E52020]"
                                                    }
                                                `}
                                            />

                                        </div>

                                        {errors.website && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.website.message}
                                            </p>
                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center justify-center gap-2 min-w-[130px] px-5 py-2.5 bg-[#E52020] hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed"
                            >

                                {saving ? (
                                    <>
                                        <Spinner
                                            size="4"
                                            color="white"
                                        />

                                        <span>
                                            {t("saving") ||
                                                "Saving..."}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={17} />

                                        <span>
                                            {setting
                                                ? t("save") || "Save Changes"
                                                : "Create Setting"}
                                        </span>
                                    </>
                                )}

                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Setting;