import { useEffect, useState } from "react";
import { filterByDateRange } from "../../utils/FilterDate";
import { filterSearch } from "../../utils/FilterSearch";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import AddUser from "./AddAdmin";
import SelectDate from "../../utils/SelectDate";
import { Car, Edit, Trash } from "lucide-react";
import EditUser from "./EditAdmin";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { useTranslation } from "react-i18next";
import ExportExcelButton from "../../utils/ExcelExportButton";


const AdminList = () => {
  const { t } = useTranslation("user");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [exportedData, setExportedData] = useState([]);


  const FilteredUser = filterByDateRange(
    filterSearch(users, "username", search),
    startDate,
    endDate,
    "createdAt"
  );

  const handleFetchUser = async () => {
    try {
      // const role = await CheckRole();
      // setRole(role);
      const res = await axiosInstance.get(APIPath.SELECT_ALL_USER);
      setUsers(res?.data?.data);
      setExportedData(
        res?.data?.data?.filter((item) => item.role === "admin").map((item) => ({
          ຊື່: item.username,
          ເບີໂທ: item.phoneNumber,
          ອີເມວ: item.email,
          ບ້ານ: item.village,
          ເມືອງ: item.district,
          ແຂວງ: item.province,
          ສະຖານະ: item.role,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      const confirmDelete = await DeleteAlert(
        t("delete_confirm"),
        t("delete_success")
      );
      if (confirmDelete) {
        await axiosInstance.delete(APIPath.DELETE_CUSTOMER(customerId));
        handleFetchUser();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  useEffect(() => {
    handleFetchUser();
  }, []);

  return (
    <div className="p-4">
      {/* Top Controls */}
      <div className="sticky top-0 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5 mb-6">
        <SelectDate onSearch={setSearch} placeholder={t("search_user")} onDateChange={({ startDate, endDate }) => { setStartDate(startDate); setEndDate(endDate); }} />
        <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-3">
          <button onClick={() => {
            setShowAdd(true)
          }
          }
            className={` bg-blue-500 hover:bg-blue-600 transition-colors w-full sm:w-auto px-6 py-2.5 sm:py-3 text-white rounded-xl font-medium cursor-pointer text-sm sm:text-base`}>
            {t("add_user")}
          </button>
          {/* Excel Export */}
          <ExportExcelButton data={exportedData} />
          {/* Excel import */}
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
        </div>
      </div>
      {/* Table Header */}
      <div className="hidden md:block w-full h-12 md:h-14 lg:h-16 bg-[#E52020] text-white">
        <div className="grid grid-cols-6 gap-3 md:gap-4 lg:gap-6 px-3 md:px-4 lg:px-6 py-3 md:py-4 font-medium text-xs md:text-sm lg:text-base">
          <div className="text-center">{t("table.index")}</div>
          {/* <div className="text-center">{t("table.code")}</div> */}
          <div className="text-center">{t("table.admin_name")}</div>
          {/* <div className="text-center">{t("table.village")}</div> */}
          {/* <div className="text-center">{t("table.district")}</div> */}
          {/* <div className="text-center">{t("table.province")}</div> */}
          <div className="text-center">{t("table.status")}</div>
          <div className="text-center">{t("table.email")}</div>
          <div className="text-center">{t("table.phone")}</div>
          <div className="text-center">{t("table.action")}</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="hidden md:block divide-y divide-gray-200 bg-gray-50 overflow-auto max-h-[400px]">
        {FilteredUser.filter((item) => item.role === "admin").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-3 md:gap-4 lg:gap-6 px-3 md:px-4 lg:px-6 py-3 md:py-4 items-center hover:bg-gray-50 cursor-pointer transition-colors text-xs md:text-sm lg:text-base"
          >
            <div className="text-center">{index + 1}</div>
            {/* <div className="text-center">{item.customer_number}</div> */}
            <div className="text-center">{item.username}</div>
            {/* <div className="text-center">{item.village}</div> */}
            {/* <div className="text-center">{item.district}</div> */}
            {/* <div className="text-center">{item.province}</div> */}
            <div className="text-center">{item.role}</div>
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
            <div className="text-center">{item.phoneNumber}</div>
            <div className="text-center flex justify-center items-center gap-4">
              <Edit
                className={`cursor-pointer `}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEdit(true);
                  setCustomerId(item.user_id);
                }}
              />
              <Trash
                className={`cursor-pointer`}
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
        {FilteredUser.map((item, index) => (
          <div
            key={index}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Car className="text-gray-600 w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900">
                  {item.username}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.customer_number}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-medium">{t("table.phone")}:</span>
                <span className="text-gray-900">{item.phoneNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-medium">{t("table.village")}:</span>
                <span className="text-gray-900">{item.village}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-medium">{t("table.district")}:</span>
                <span className="text-gray-900">{item.district}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-medium">{t("table.province")}:</span>
                <span className="text-gray-900">{item.province}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-medium">{t("table.email")}:</span>
                <span className="text-blue-500">
                  {item.email || "-"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-medium">{t("table.status")}:</span>
                <span className="text-gray-900">{item.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popups */}
      <AddUser
        show={showAdd}
        onClose={() => setShowAdd(false)}
        handleFetch={handleFetchUser}
      />
      <EditUser
        show={showEdit}
        onClose={() => setShowEdit(false)}
        customerId={customerId}
        handleFetch={handleFetchUser}
      />
    </div>
  );
};

export default AdminList;
