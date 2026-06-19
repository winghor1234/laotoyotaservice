import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import AddUser from "./AddUser";
import SelectDate from "../../utils/SelectDate";
import { Car, Edit, Eye, Lock, Trash, UserLock } from "lucide-react";
import EditUser from "./EditUser";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import ExportExcelPopup from "../../utils/exportExelPopup";
import DownloadButton from "../../utils/DownloadButton";
import ImportExcel from "../../utils/ImportExel";
import { toSafeString } from "../../utils/toSafeString";
import ChangePassword from "./ChangePassword";
import { FaWhatsappSquare } from "react-icons/fa";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
// import { decryptData } from "../../utils/decript";

const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return "";
    return phone
        .replace(/\+/g, "")
        .replace(/\s/g, "")
        .replace(/-/g, "");
};

const UserList = () => {
    const { t } = useTranslation("user");
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [customerId, setCustomerId] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();


    const {
        data: customer,
        page,
        totalPage,
        search,
        handleSearch,
        handleDateChange,
        handlePageChange,
        fetchData,
        getPageNumbers,
    } = useServerFilterPagination({
        apiCall: ({ page, limit, search, startDate, endDate }) => {
            return axiosInstance.get(APIPath.GET_ALL_USER, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                    status: "general",
                },
            });
        },
    });

    const handleToDetailUser = (id) => {
        navigate(`/user/user-detail/${id}`);
    };


    const handleDeleteUser = async (customerId) => {
        try {
            const confirmDelete = await DeleteAlert(t("delete_confirm"), t("delete_success"));
            if (confirmDelete) {
                await axiosInstance.delete(APIPath.DELETE_CUSTOMER(customerId));
                fetchData();
            }
        } catch (error) {
            console.error("Failed to delete user:", error);
            SuccessAlert(t("delete_error"), 1500, "error");
        }
    };



    const handleResetPassword = async (item) => {
        const id = item.user_id
        try {
            const res = await axiosInstance.put(APIPath.RESET_CUSTOMER_PASSWORD(id));
            const newPassword = res?.data?.temporaryPassword
            const whatsappMessage =
                `ສະບາຍດີ ${item.username},

ລະຫັດຜ່ານບັນຊີຂອງທ່ານໄດ້ຖືກຣີເຊັດແລ້ວ

📱 ເບີໂທ:
${item.phoneNumber}

🔐 ລະຫັດຜ່ານໃໝ່:
${newPassword}

ກະລຸນາປ່ຽນລະຫັດຜ່ານຫຼັງຈາກເຂົ້າລະບົບ

ຂອບໃຈ 🙏`;
            const whatsappUrl = `https://wa.me/${formatPhoneForWhatsApp(item.phoneNumber)}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, "_blank");
        } catch (error) {
            console.error("Error sending password to WhatsApp:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="flex justify-end items-center mb-6">
                <SelectDate
                    searchValue={search}
                    onSearchChange={handleSearch}
                    onDateChange={handleDateChange}
                />
                {/* download button */}
                <DownloadButton open={open} setOpen={setOpen} />
                {open && (
                    <ExportExcelPopup
                        apiUrl={APIPath.EXPORT_CUSTOMER}
                        fileName="customer-report.xlsx"
                        onClose={() => setOpen(false)}
                    />
                )}

                <div className="flex gap-2 ">
                    <button onClick={() => setShowAdd(true)} className="bg-blue-500 hover:bg-blue-600 transition-colors w-full sm:w-auto px-5 py-3.5  text-white rounded font-medium cursor-pointer text-sm sm:text-base">
                        {t("add_user")}
                    </button>
                    <ImportExcel
                        apiPath={APIPath.REGISTER}
                        requiredFields={[
                            "Name",
                            "PhoneNumber",
                            "Province",
                            "District",
                            "Village",
                        ]}
                        transformData={(item) => ({
                            username: toSafeString(item["Name"]),
                            phoneNumber: toSafeString(item["PhoneNumber"]),
                            province: toSafeString(item["Province"]),
                            district: toSafeString(item["District"]),
                            village: toSafeString(item["Village"]),
                            email: item["Email"] ? toSafeString(item["Email"]) : null,
                        })}
                        onUploadSuccess={() =>
                            fetchData()
                        }
                    />
                </div>
            </div>
            {/* Table Header */}
            <div className="hidden md:block w-full h-12 md:h-12 lg:h-14 rounded-t-lg bg-[#E52020] text-white">
                <div className="grid grid-cols-10 gap-3 md:gap-4 lg:gap-6 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-xs md:text-sm lg:text-base">
                    <div className="flex justify-center items-center">{t("index")}</div>
                    <div className="flex justify-center items-center">{t("code")}</div>
                    <div className="flex justify-center items-center">{t("username")}</div>
                    <div className="flex justify-center items-center">{t("village")}</div>
                    <div className="flex justify-center items-center">{t("district")}</div>
                    <div className="flex justify-center items-center">{t("province")}</div>
                    <div className="flex justify-center items-center">{t("phone")}</div>
                    <div className="flex justify-center items-center">{t("email")}</div>
                    <div className="flex justify-center items-center">{t("status")}</div>
                    {/* <div className="flex justify-center items-center">{t("point")}</div> */}
                    <div className="flex justify-center items-center">{t("action")}</div>
                </div>
            </div>

            {/* Table Body */}
            <div className="hidden md:block divide-y divide-gray-200 bg-gray-50 overflow-auto max-h-[400px]">
                {customer.filter((item) => item.role === "general").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-10 gap-3 md:gap-4 lg:gap-6 px-3 md:px-4 lg:px-6 py-3 md:py-4 items-center hover:bg-gray-50 cursor-pointer transition-colors text-xs md:text-sm lg:text-base"
                    >
                        <div className="text-center">{index + 1}</div>
                        <div className="text-center line-clamp-1">{item.customer_number}</div>
                        <div className="text-center line-clamp-1">{item.username}</div>
                        <div className="text-center line-clamp-1">{item.village}</div>
                        <div className="text-center line-clamp-1">{item.district}</div>
                        <div className="text-center line-clamp-1">{item.province}</div>
                        <div className="text-center line-clamp-1">{item.phoneNumber}</div>
                        <div className="wrap-anywhere text-center line-clamp-1">
                            {item.email ? (<a href={`mailto:${item.email}`}
                                className="text-blue-500 hover:underline"
                            >
                                {item.email}
                            </a>
                            ) : (
                                "-"
                            )}
                        </div>
                        <div className="text-center">{item.role}</div>
                        <div className="flex justify-center items-center">
                            <div className="flex items-center gap-1">

                                {/* View */}
                                <button
                                    onClick={() => handleToDetailUser(item.user_id)}
                                    className="p-0.5 hover:bg-gray-100 rounded"
                                >
                                    <Eye className="w-4 h-4 text-gray-600" />
                                </button>

                                {/* Edit */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowEdit(true);
                                        setCustomerId(item.user_id);
                                    }}
                                    className="p-0.5 hover:bg-gray-100 rounded"
                                >
                                    <Edit className="w-4 h-4 text-blue-500" />
                                </button>

                                {/* Password */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowChangePassword(true);
                                        setCustomerId(item.user_id);
                                    }}
                                    className="p-0.5 hover:bg-gray-100 rounded"
                                >
                                    <UserLock className="w-4 h-4 text-orange-500" />
                                </button>

                                {/* WhatsApp */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleResetPassword(item);
                                    }}
                                    className="p-0.5 hover:bg-gray-100 rounded"
                                >
                                    <FaWhatsappSquare className="w-4 h-4 text-green-500" />
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteUser(item.user_id);
                                    }}
                                    className="p-0.5 hover:bg-gray-100 rounded"
                                >
                                    <Trash className="w-4 h-4 text-red-500" />
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden divide-y divide-gray-200">
                {customer.map((item, index) => (
                    <div
                        onClick={() =>
                            handleToDetailUser(
                                item.user_id
                            )
                        }
                        key={index}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Car className="text-gray-600 w-6 h-6" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
                                    {item.username}
                                </h3>

                                <p className="text-gray-600 text-sm line-clamp-1">
                                    {
                                        item.customer_number
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">
                                    {t("phone")}:
                                </span>

                                <span className="text-gray-900 line-clamp-1">
                                    {
                                        item.phoneNumber
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">
                                    {t("village")}:
                                </span>

                                <span className="text-gray-900 line-clamp-1">
                                    {item.village}
                                </span>
                            </div>

                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">
                                    {t("district")}:
                                </span>

                                <span className="text-gray-900 line-clamp-1">
                                    {
                                        item.district
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">
                                    {t("province")}:
                                </span>

                                <span className="text-gray-900 line-clamp-1">
                                    {
                                        item.province
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">
                                    {t("email")}:
                                </span>

                                <span className="text-blue-500 line-clamp-1">
                                    {item.email ||
                                        "-"}
                                </span>
                            </div>

                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">
                                    {t("status")}:
                                </span>

                                <span className="text-gray-900 line-clamp-1">
                                    {item.role}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center items-center gap-5 pt-4 mt-4 border-t border-gray-200">

                            {/* Detail */}
                            <Eye
                                onClick={(e) => {
                                    e.stopPropagation();

                                    handleToDetailUser(
                                        item.user_id
                                    );
                                }}
                                className="text-gray-600 cursor-pointer h-6 w-6 hover:text-gray-800 transition-colors"
                            />

                            {/* Edit */}
                            <Edit
                                className="cursor-pointer h-6 w-6 text-blue-500 hover:text-blue-700 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    setShowEdit(
                                        true
                                    );

                                    setCustomerId(
                                        item.user_id
                                    );
                                }}
                            />

                            {/* Change Password */}
                            <UserLock
                                className="cursor-pointer h-6 w-6 text-orange-500 hover:text-orange-700 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    setShowChangePassword(
                                        true
                                    );

                                    setCustomerId(
                                        item.user_id
                                    );
                                }}
                            />

                            {/* WhatsApp */}
                            <FaWhatsappSquare
                                className="cursor-pointer h-6 w-6 text-green-500 hover:text-green-700 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();

                                    handleResetPassword(
                                        item
                                    );
                                }}
                            />
                            <Trash
                                className="cursor-pointer h-6 w-6 text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(item.user_id)
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination (แก้ไขให้โชว์แค่บางช่วงหน้า) */}
            <div className="flex justify-end mt-4 gap-2 items-center">
                {/* ปุ่มย้อนกลับ */}
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    ‹
                </button>

                {getPageNumbers().map((p) => (
                    <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`px-3 py-1 rounded ${page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {p}
                    </button>
                ))}

                {/* ปุ่มถัดไป */}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPage || totalPage === 0}
                    className={`px-3 py-1 rounded ${page === totalPage || totalPage === 0
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    ›
                </button>
            </div>

            {/* Popups */}
            <AddUser
                show={showAdd}
                onClose={() => setShowAdd(false)}
                handleFetch={fetchData}
            />
            <EditUser
                show={showEdit}
                onClose={() => setShowEdit(false)}
                customerId={customerId}
                handleFetch={fetchData}
            />
            <ChangePassword
                show={showChangePassword}
                onClose={() => setShowChangePassword(false)}
                customerId={customerId}
                handleFetch={fetchData}
            />
        </div >
    );
};

export default UserList;