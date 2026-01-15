import { useEffect, useState } from "react";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { filterSearch } from "../../utils/FilterSearch";
import { filterByDateRange } from "../../utils/FilterDate";
import { useNavigate } from "react-router-dom";
import AddBranch from "./AddBranch";
import SelectDate from "../../utils/SelectDate";
import { Edit, Eye, Trash } from "lucide-react";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
//import EditBranch from "./EditBranch";
import { useTranslation } from "react-i18next";
import EditBranch from "./EditBranch";

const BranchList = () => {
    const { t } = useTranslation("branch");

    const [showEditBranch, setShowEditBranch] = useState(false);
    const [showAddBranch, setShowAddBranch] = useState(false);
    const [Branchs, setBranchs] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleFetchBranch = async () => {
        try {
            const res = await axiosInstance.get(APIPath.SELECT_ALL_BRANCH);
            setBranchs(res?.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch Branchs:", error);
            setBranchs([]);
        }
    };

    const handleDeleteBranch = async (branch_id) => {
        // console.log("Delete Branch ID:", branch_id);
        try {
            const confirmDelete = await DeleteAlert(t("delete_confirm"), t("delete_success"));
            if (confirmDelete) {
                await axiosInstance.delete(APIPath.DELETE_BRANCH(branch_id));
                handleFetchBranch();
            }
        } catch (error) {
            console.error("Failed to delete Branch:", error);
            SuccessAlert(t("delete_failed"), 1500, "error");
        }
    };

    useEffect(() => {
        handleFetchBranch();
    }, []);

    const handleToDetailBranch = (id) => {
        navigate(`/user/BranchDetail/${id}`);
    };

    // ເພີ່ມການກວດສອບວ່າ Branchs ເປັນ array ກ່ອນ filter
    const filteredBranchs = Array.isArray(Branchs)
        ? filterByDateRange(
            filterSearch(Branchs, "title", search),
            startDate,
            endDate,
            "createdAt"
        )
        : [];

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-4 lg:gap-6 mb-4 flex-1">
                <SelectDate
                    onSearch={setSearch}
                    placeholder={t("search_placeholder")}
                    onDateChange={({ startDate, endDate }) => {
                        setStartDate(startDate);
                        setEndDate(endDate);
                    }}
                />
                <div onClick={() => setShowAddBranch(true)} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto px-10 py-2.5 sm:py-3 text-white rounded-xl font-medium cursor-pointer text-sm sm:text-base">
                        {t("add_branch")}
                    </button>
                </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 mb-6">
                {filteredBranchs.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                ) : (
                    filteredBranchs.map((item, index) => (
                        <div
                            key={item.branch_id || index}
                            onClick={() => handleToDetailBranch(item.branch_id)}
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
                                            setShowEditBranch(true);
                                            setSelectedBranch(item.branch_id);
                                        }}
                                    />
                                    <Trash
                                        className="w-4 h-4 hover:text-red-600 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteBranch(item.branch_id);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {/* {item.image && (
                                    <img
                                        src={item.image}
                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                        alt={item.title || 'Branch image'}
                                    />
                                )} */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 truncate mb-1">{item.branch_name}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{item.location}</p>
                                    <p className="text-sm text-gray-600 mt-1">{item.phone}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop/Tablet Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden w-full">
                <div className="w-full h-10 md:h-12 lg:h-14 bg-[#E52020] text-white">
                    <div className="grid grid-cols-6 gap-3 md:gap-8 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-sm md:text-sm lg:text-base">
                        <div className="flex justify-center items-center">{t("index")}</div>
                        <div className="flex justify-center items-center">{t("branch_code")}</div>
                        <div className="flex justify-center items-center">{t("branch_name")}</div>
                        <div className="flex justify-center items-center">{t("location")}</div>
                        <div className="flex justify-center items-center">{t("phone")}</div>
                        <div className="flex justify-center items-center">{t("action")}</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {filteredBranchs.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">{t("no_data")}</div>
                    ) : (
                        filteredBranchs
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((item, index) => (
                                <div
                                    onClick={() => handleToDetailBranch(item.branch_id)}
                                    key={item.branch_id || index}
                                    className="grid grid-cols-6 gap-3 md:gap-4 px-2 md:px-3 lg:px-4 py-2 md:py-3 lg:py-4 items-center hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                        {index + 1}
                                    </div>
                                    <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                        {item.branch_code}
                                        {/* {item.image && (
                                            <img
                                                src={item.image}
                                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                                                alt={item.title || 'Branch image'}
                                            />
                                        )} */}
                                    </div>
                                    <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                        {item.branch_name}
                                    </div>
                                    <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                        {item.location}
                                    </div>
                                    <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center">
                                        {item.phone}
                                    </div>
                                    <div className="text-xs md:text-sm lg:text-base font-medium flex justify-center items-center gap-3 md:gap-6">
                                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                        <Edit
                                            className="w-4 h-4 md:w-5 md:h-5 hover:text-blue-600 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowEditBranch(true);
                                                setSelectedBranch(item.branch_id);
                                            }}
                                        />
                                        <Trash
                                            className="w-4 h-4 md:w-5 md:h-5 hover:text-red-600 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteBranch(item.branch_id);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>

            <EditBranch
                show={showEditBranch}
                onClose={() => setShowEditBranch(false)}
                branch_id={selectedBranch}
                handleFetchBranch={handleFetchBranch}
            />
            <AddBranch
                show={showAddBranch}
                onClose={() => setShowAddBranch(false)}
                handleFetchBranch={handleFetchBranch}
            />
        </div>
    );
}

export default BranchList;