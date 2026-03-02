import { Edit, Trash } from "lucide-react";
import AddCarFormPopup from "./AddCarForm";
import SelectDate from "../../utils/SelectDate";
import { useState } from "react";
import EditCarFormPopup from "./EditCarForm";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import ExportExcelButton from "../../utils/ExcelExportButton";
import { useTranslation } from "react-i18next";
import ImportExcel from "../../utils/ImportExel";
import { useNavigate } from "react-router-dom";
import useServerFilterPagination from "../../utils/useServerFilterPagination";
import ExportExcelPopup from "../../utils/exportExelPopup";
import DownloadButton from "../../utils/DownloadButton";

const CarList = () => {
  const { t } = useTranslation("car");
  const navigate = useNavigate();

  // Popup
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [showEditCarForm, setShowEditCarForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [carId, setCarId] = useState(null);

  // ===============================
  // useServerFilterPagination
  // ===============================
  const {
    data: car,
    page,
    totalPage,
    search,
    limit,
    handleSearch,
    handleDateChange,
    handlePageChange,
    fetchData,
    getPageNumbers,
  } = useServerFilterPagination({
    apiCall: ({ page, limit, search, startDate, endDate }) => {
      return axiosInstance.get(APIPath.GET_ALL_CAR, {
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


  console.log("car :", car);

  // ===============================
  // Export (ถ้ายังต้องใช้)
  // ===============================
  // const exportedData = car?.map((item) => ({
  //   "ລະຫັດ": item.userId,
  //   "ຊື່ລົດ": item.model,
  //   "ປ້າຍທະບຽນ": item.plateNumber,
  //   "ເລກຖັງ": item.frameNumber,
  //   "ເລກຈັກ": item.engineNumber,
  //   "ແຂວງ": item.province,
  //   "ສີ": item.color,
  // }));
  // console.log("car :",  totalPage);


  // ===============================
  // Delete
  // ===============================

  const handleDelete = async (id) => {
    const confirmDelete = await DeleteAlert(
      t("delete_confirm"),
      t("delete_success")
    );
    if (!confirmDelete) return;
    await axiosInstance.delete(APIPath.DELETE_CAR(id));
    fetchData(); // refresh list
  };

  const handleToDetailCar = (id) =>
    navigate(`/user/car-detail/${id}`);



  return (
    <div>
      {/* Search + Date + Export or download */}
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
            apiUrl={APIPath.EXPORT_CAR}
            fileName="car-report.xlsx"
            onClose={() => setOpen(false)}
          />
        )}
        <button onClick={() => setShowAddCarForm(true)} className="bg-blue-600 hover:bg-blue-700 transition-colors px-5 py-3.5 text-white rounded font-medium cursor-pointer text-sm sm:text-base mr-2">
          {t("add")}
        </button>
        <ImportExcel
          apiPath={APIPath.CREATE_CAR}
          requiredFields={[
            "ຊື່ລົດ",
            "ປ້າຍທະບຽນ",
            "ເລກຖັງ",
            "ເລກຈັກ",
            "ແຂວງ",
            "ສີ",
          ]}
          transformData={(item) => ({
            userId: null,
            model: item["ຊື່ລົດ"]?.trim(),
            plateNumber: item["ປ້າຍທະບຽນ"]?.trim(),
            frameNumber: item["ເລກຖັງ"]?.trim(),
            engineNumber: item["ເລກຈັກ"]?.trim(),
            province: item["ແຂວງ"]?.trim(),
            color: item["ສີ"]?.trim(),
          })}
          onUploadSuccess={() =>
            fetchData()
          }
        />
      </div>

      {/* Desktop Card Layout */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="w-full h-10 md:h-12 lg:h-14 bg-[#E52020] text-white">
          <div className="grid grid-cols-8 gap-3 md:gap-8 px-3 md:px-4 lg:px-8 py-3 md:py-4 font-medium text-sm md:text-sm lg:text-base">
            <div className="flex justify-center items-center">{t("index")}</div>
            <div className="flex justify-center items-center">{t("car_model")}</div>
            <div className="flex justify-center items-center">{t("plate")}</div>
            <div className="flex justify-center items-center">{t("color")}</div>
            <div className="flex justify-center items-center">{t("frame")}</div>
            <div className="flex justify-center items-center">{t("engine")}</div>
            <div className="flex justify-center items-center">{t("province")}</div>
            <div className="flex justify-center items-center">{t("action")}</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {car?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleToDetailCar(item.car_id)}
              className="hidden md:grid md:grid-cols-8 md:gap-2 text-center items-center w-full px-4 py-3 hover:bg-gray-50 cursor-pointer"
            >
              <div className="text-center">
                {(page - 1) * limit + index + 1}
              </div>
              <div className="text-center line-clamp-1">{item.model}</div>
              <div className="text-center line-clamp-1">{item.plateNumber}</div>
              <div className="text-center line-clamp-1">{item.color}</div>
              <div className="text-center line-clamp-1">{item.engineNumber}</div>
              <div className="text-center line-clamp-1">{item.frameNumber}</div>
              <div className="text-center line-clamp-1">{item.province}</div>
              <div className="flex justify-center gap-4">
                <Edit
                  onClick={(e) => {
                    e.stopPropagation();
                    setCarId(item.car_id);
                    setShowEditCarForm(true);
                  }}
                />
                <Trash
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.car_id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Mobile Card Layout */}
        <div>
          {car?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleToDetailCar(item.car_id)}
              className="md:hidden flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="font-semibold">{t("no")}:</span>
                <span>{(page - 1) * limit + index + 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("model")}:</span>
                <span>{item.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("plate")}:</span>
                <span>{item.plateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("color")}:</span>
                <span>{item.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("engine")}:</span>
                <span>{item.engineNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("frame")}:</span>
                <span>{item.frameNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t("province")}:</span>
                <span>{item.province}</span>
              </div>
              <div className="flex gap-4 mt-2">
                <Edit
                  className="text-blue-500 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCarId(item.car_id);
                    setShowEditCarForm(true);
                  }}
                />
                <Trash
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.car_id);
                  }}
                />
              </div>
              <hr />
            </div>
          ))}
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

      <AddCarFormPopup
        show={showAddCarForm}
        onClose={() => setShowAddCarForm(false)}
        handleFetchCar={() => fetchData(page)}
      />

      <EditCarFormPopup
        show={showEditCarForm}
        onClose={() => setShowEditCarForm(false)}
        carId={carId}
        handleFetchCar={() => fetchData(page)}
      />
    </div>
  );
};

export default CarList;

