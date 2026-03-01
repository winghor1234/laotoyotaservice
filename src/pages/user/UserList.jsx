import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import AddUser from "./AddUser";
import SelectDate from "../../utils/SelectDate";
import { Car, Edit, Trash } from "lucide-react";
import EditUser from "./EditUser";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import ExportExcelPopup from "../../utils/exportExelPopup";

const UserList = () => {
    const { t } = useTranslation("user");
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [customerId, setCustomerId] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();


    // setExportedData(
    //     res?.data?.data?.map((item) => ({
    //         ຊື່: item.username,
    //         ເບີໂທ: item.phoneNumber,
    //         ອີເມວ: item.email,
    //         ບ້ານ: item.village,
    //         ເມືອງ: item.district,
    //         ແຂວງ: item.province,
    //         ສະຖານະ: item.role,
    //     }))

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

    const handleDelete = async (customerId) => {
        try {
            const confirmDelete = await DeleteAlert(
                t("delete_confirm"),
                t("delete_success")
            );
            if (confirmDelete) {
                await axiosInstance.delete(APIPath.DELETE_CUSTOMER(customerId));
                fetchData();
            }
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const handleToDetailUser = (id) => {
        navigate(`/user/user-detail/${id}`);
    };
    {/* <ImportExcel
            apiPath={APIPath.REGISTER}
            requiredFields={["ຊື່", "ວັນທີເດືອນປີ", "ໂຊນ"]}
            transformData={(item) => ({
              time: item["ເວລາ"],
              date: item["ວັນທີເດືອນປີ"],
              zoneId: item["ໂຊນ"],
            })}
            onUploadSuccess={handleFetchUser} 
            /> */}

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-4">
            <div className=" p-9 flex justify-end items-center">
                <SelectDate
                    searchValue={search}
                    onSearchChange={handleSearch}
                    onDateChange={handleDateChange}
                />
                {/* download button */}
                <button onClick={() => setOpen(true)} className="flex items-center bg-gray-600 hover:bg-gray-700 text-white rounded gap-2 px-3 py-3.5">
                    {t("export")}
                </button>
                {open && (
                    <ExportExcelPopup
                        apiUrl={APIPath.EXPORT_CUSTOMER}
                        fileName="customer-report.xlsx"
                        onClose={() => setOpen(false)}
                    />
                )}
                <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-3">
                    <button onClick={() => setShowAdd(true)} className="bg-blue-500 hover:bg-blue-600 transition-colors w-full sm:w-auto px-6 py-2.5 sm:py-3 text-white rounded-xl font-medium cursor-pointer text-sm sm:text-base">
                        {t("add_user")}
                    </button>
                </div>
            </div>
            {/* Table Header */}
            <div className="hidden md:block w-full h-12 md:h-14 lg:h-16 bg-[#E52020] text-white">
                <div className="grid grid-cols-10 gap-3 md:gap-4 lg:gap-6 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-xs md:text-sm lg:text-base">
                    <div className="text-center">{t("index")}</div>
                    <div className="text-center">{t("code")}</div>
                    <div className="text-center">{t("username")}</div>
                    <div className="text-center">{t("village")}</div>
                    <div className="text-center">{t("district")}</div>
                    <div className="text-center">{t("province")}</div>
                    <div className="text-center">{t("phone")}</div>
                    <div className="text-center">{t("email")}</div>
                    <div className="text-center">{t("status")}</div>
                    <div className="text-center">{t("action")}</div>
                </div>
            </div>

            {/* Table Body */}
            <div className="hidden md:block divide-y divide-gray-200 bg-gray-50 overflow-auto max-h-[400px]">
                {customer.filter((item) => item.role === "general").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
                    <div
                        onClick={() => handleToDetailUser(item.user_id)}
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
                        <div className="wrap-anywhere text-center">
                            {item.email ? (
                                <a
                                    href={`mailto:${item.email}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    {item.email}
                                </a>
                            ) : (
                                "-"
                            )}
                        </div>
                        <div className="text-center">{item.role}</div>
                        <div className="text-center flex justify-center items-center gap-4">
                            <Edit
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEdit(true);
                                    setCustomerId(item.user_id);
                                }}
                            />
                            <Trash
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.user_id);
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden divide-y divide-gray-200">
                {customer.map((item, index) => (
                    <div
                        onClick={() => handleToDetailUser(item.user_id)}
                        key={index}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Car className="text-gray-600 w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
                                    {item.username}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-1">
                                    {item.customer_number}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">{t("phone")}:</span>
                                <span className="text-gray-900 line-clamp-1">{item.phoneNumber}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">{t("village")}:</span>
                                <span className="text-gray-900 line-clamp-1">{item.village}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">{t("district")}:</span>
                                <span className="text-gray-900 line-clamp-1">{item.district}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">{t("province")}:</span>
                                <span className="text-gray-900 line-clamp-1">{item.province}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">{t("email")}:</span>
                                <span className="text-blue-500">
                                    {item.email || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 font-medium">{t("status")}:</span>
                                <span className="text-gray-900 line-clamp-1">{item.role}</span>
                            </div>
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
        </div>
    );
};

export default UserList;