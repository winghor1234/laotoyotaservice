import { useEffect, useState } from "react";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { useNavigate } from "react-router-dom";
import AddEmployee from "./AddEmployee";
import SelectDate from "../../utils/SelectDate";
import { Edit, Eye, Trash } from "lucide-react";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { useTranslation } from "react-i18next";
import EditEmployee from "./EditEmployee";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import ExportExcelPopup from "../../utils/exportExelPopup";
import DownloadButton from "../../utils/DownloadButton";

const EmployeeList = () => {
    const { t } = useTranslation("employee");
    const [showEditEmployee, setShowEditEmployee] = useState(false);
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const {
        data: employee,
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
            return axiosInstance.get(APIPath.GET_ALL_EMPLOYEE, {
                params: {
                    page,
                    limit,
                    search: search || undefined,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                },
            });
        },
    });

    const handleDeleteEmployee = async (employee_id) => {
        try {
            const confirmDelete = await DeleteAlert(t("delete_confirm"), t("delete_success"));
            if (confirmDelete) {
                // Assuming APIPath.DELETE_EMPLOYEE exists
                await axiosInstance.delete(APIPath.DELETE_EMPLOYEE(employee_id));
                fetchData();
            }
        } catch (error) {
            console.error("Failed to delete Employee:", error);
            SuccessAlert(t("delete_failed"), 1500, "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToDetailEmployee = (id) => {
        navigate(`/user/employee-detail/${id}`);
    };


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
                        apiUrl={APIPath.EXPORT_EMPLOYEE}
                        fileName="employee-report.xlsx"
                        onClose={() => setOpen(false)}
                    />
                )}
                <div onClick={() => setShowAddEmployee(true)} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto px-5 py-3.5 text-white rounded font-medium cursor-pointer text-sm sm:text-base">
                        {t("add_employee")}
                    </button>
                </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 mb-6">
                {employee.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                ) : (
                    employee.map((item, index) => (
                        <div
                            key={item.employee_id || index}
                            onClick={() => handleToDetailEmployee(item.employee_id)}
                            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">#{index + 1}</div>
                                <div className="flex items-center gap-3">
                                    <Eye className="w-4 h-4" />
                                    <Edit
                                        className="w-4 h-4 hover:text-blue-600 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowEditEmployee(true);
                                            setSelectedEmployee(item.employee_id);
                                        }}
                                    />
                                    <Trash
                                        className="w-4 h-4 hover:text-red-600 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteEmployee(item.employee_id);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{item.employee_name}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.position}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop/Tablet Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full">
                <div className="w-full h-12 md:h-12 lg:h-14 bg-[#E52020] text-white">
                    <div className="grid grid-cols-6 gap-3 md:gap-8 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-sm md:text-sm lg:text-base">
                        <div className="flex justify-center items-center">{t("index")}</div>
                        <div className="flex justify-center items-center">{t("employee_code")}</div>
                        <div className="flex justify-center items-center">{t("employee_name")}</div>
                        <div className="flex justify-center items-center">{t("position")}</div>
                        <div className="flex justify-center items-center">{t("action")}</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {employee.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                    ) : (
                        employee
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((item, index) => (
                                <div
                                    onClick={() => handleToDetailEmployee(item.employee_id)}
                                    key={item.employee_id || index}
                                    className="grid grid-cols-6 gap-3 md:gap-4 px-2 md:px-3 lg:px-4 py-2 md:py-3 lg:py-4 items-center hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="text-xs md:text-sm lg:text-base font-medium text-center line-clamp-2">
                                        {index + 1}
                                    </div>
                                    <div className="text-xs md:text-sm lg:text-base font-medium text-center line-clamp-2">
                                        {item.employee_code}
                                    </div>
                                    <div className="text-xs md:text-sm lg:text-base font-medium text-center line-clamp-2">
                                        {item.employee_name}
                                    </div>
                                    <div className="text-xs md:text-sm lg:text-base font-medium text-center line-clamp-2">
                                        {item.position}
                                    </div>
                                    <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center gap-3 md:gap-6">
                                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                        <Edit
                                            className="w-4 h-4 md:w-5 md:h-5 hover:text-blue-600 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowEditEmployee(true);
                                                setSelectedEmployee(item.employee_id);
                                            }}
                                        />
                                        <Trash
                                            className="w-4 h-4 md:w-5 md:h-5 hover:text-red-600 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteEmployee(item.employee_id);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                    )}
                </div>
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
            <EditEmployee
                show={showEditEmployee}
                onClose={() => setShowEditEmployee(false)}
                employee_id={selectedEmployee}
                handleFetchEmployee={fetchData}
            />
            <AddEmployee
                show={showAddEmployee}
                onClose={() => setShowAddEmployee(false)}
                handleFetchEmployee={fetchData}
            />
        </div>
    );
}

export default EmployeeList;