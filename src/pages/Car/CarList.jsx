import { Edit, Eye, Trash } from "lucide-react";
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
import { toSafeString } from "../../utils/toSafeString";

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
            "FrameNumber",
            "PlateNumber",
            "Model",
          ]}
          transformData={(item) => ({
            userId: null,
            frameNumber: toSafeString(item["FrameNumber"]),
            plateNumber: toSafeString(item["PlateNumber"]),
            model: toSafeString(item["Model"]),
            engineNumber: item["EngineNumber"] ? toSafeString(item["EngineNumber"]) : null,
            province: item["Province"] ? toSafeString(item["Province"]) : null,
            color: item["Color"] ? toSafeString(item["Color"]) : null,
          })}
          onUploadSuccess={() =>
            fetchData()
          }
        />
      </div>

      {/* Desktop Card Layout */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="w-full h-10 md:h-12 lg:h-14 bg-[#E52020] text-white hidden md:block">
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
              className="hidden md:grid md:grid-cols-8 md:gap-2 text-center items-center w-full px-4 py-3 hover:bg-gray-50 cursor-pointer"
            >
              <div className="text-center">
                {(page - 1) * limit + index + 1}
              </div>
              <div className="text-center line-clamp-1">{item.model}</div>
              <div className="text-center line-clamp-1">{item.plateNumber}</div>
              <div className="text-center line-clamp-1">{item.color}</div>
              <div className="text-center line-clamp-1">{item.frameNumber}</div>
              <div className="text-center line-clamp-1">{item.engineNumber}</div>
              <div className="text-center line-clamp-1">{item.province}</div>
              <div className="flex justify-center gap-4">
                <Eye onClick={() => handleToDetailCar(item.car_id)} className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800" />
                <Edit
                  className="text-gray-600 -4 h-4 md:w-5 md:h-5 hover:text-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCarId(item.car_id);
                    setShowEditCarForm(true);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Mobile Card Layout */}
        <div className="md:hidden divide-y divide-gray-200">
          {car?.map((item, index) => (
            <div
              key={index}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-800 font-semibold">
                    {t("index")}:{(page - 1) * limit + index + 1}
                  </p>
                </div>
              </div>

              {/* Information */}
              <div className="grid grid-cols-1 gap-2 text-sm">

                {/* Model */}
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-gray-500">
                    {t("model")}:
                  </span>

                  <span className="text-gray-800 text-right break-all">
                    {item.model}
                  </span>
                </div>

                {/* Plate */}
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-gray-500">
                    {t("plate")}:
                  </span>

                  <span className="text-gray-800 text-right break-all">
                    {item.plateNumber}
                  </span>
                </div>

                {/* Color */}
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-gray-500">
                    {t("color")}:
                  </span>

                  <span className="text-gray-800 text-right break-all">
                    {item.color}
                  </span>
                </div>

                {/* Engine */}
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-gray-500">
                    {t("engine")}:
                  </span>

                  <span className="text-gray-800 text-right break-all">
                    {item.engineNumber}
                  </span>
                </div>

                {/* Frame */}
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-gray-500">
                    {t("frame")}:
                  </span>

                  <span className="text-gray-800 text-right break-all">
                    {item.frameNumber}
                  </span>
                </div>

                {/* Province */}
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-gray-500">
                    {t("province")}:
                  </span>

                  <span className="text-gray-800 text-right break-all">
                    {item.province}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-gray-200">

                {/* Detail */}
                <button
                  onClick={() =>
                    handleToDetailCar(
                      item.car_id
                    )
                  }
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-5 h-5 text-gray-700" />
                </button>

                {/* Edit */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    setCarId(
                      item.car_id
                    );

                    setShowEditCarForm(
                      true
                    );
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-5 h-5 text-blue-700" />
                </button>

              </div>
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

