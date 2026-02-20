import { Car, Edit, Trash } from "lucide-react";
import AddCarFormPopup from "./AddCarForm";
import SelectDate from "../../utils/SelectDate";
import { useEffect, useState } from "react";
import EditCarFormPopup from "./EditCarForm";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import ExportExcelButton from "../../utils/ExcelExportButton";
import { useTranslation } from "react-i18next";
import ImportExcel from "../../utils/ImportExel";
import { useNavigate } from "react-router-dom";

const CarList = () => {
  const { t } = useTranslation("car");
  const navigate = useNavigate();

  // Popup
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [showEditCarForm, setShowEditCarForm] = useState(false);
  const [carId, setCarId] = useState(null);

  // Data
  const [car, setCar] = useState([]);
  const [exportedData, setExportedData] = useState([]);

  // Filter
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Pagination (Server-side)
  const [page, setPage] = useState(1);
  const limit = 2;
  const [totalPage, setTotalPage] = useState(1);

  // ===============================
  // Fetch Data (Server-side)
  // ===============================
  const handleFetchCar = async (
    pageNumber = 1,
    searchValue = search,
    start = startDate,
    end = endDate
  ) => {
    try {
      const res = await axiosInstance.get(APIPath.GET_ALL_CAR, {
        params: {
          page: pageNumber,
          limit: limit,
          search: searchValue || undefined,
          startDate: start ? start.toISOString() : undefined,
          endDate: end ? end.toISOString() : undefined,
        },
      });

      const data = res?.data?.data;

      setCar(data?.car || []);
      setTotalPage(data?.totalPage || 1);
      setPage(data?.currentPage || 1);

      // export data (เฉพาะข้อมูลหน้านี้ตาม backend)
      setExportedData(
        (data?.car || []).map((item) => ({
          "ລະຫັດ": item.userId,
          "ຊື່ລົດ": item.model,
          "ປ້າຍທະບຽນ": item.plateNumber,
          "ເລກຖັງ": item.frameNumber,
          "ເລກຈັກ": item.engineNumber,
          "ແຂວງ": item.province,
          "ສີ": item.color,
        }))
      );
    } catch (error) {
      console.error("Error fetching car data:", error);
    }
  };

  // โหลดครั้งแรก + ทุกครั้งที่ page เปลี่ยน
  useEffect(() => {
    handleFetchCar(page);
  }, [page]);

  // ===============================
  // Handlers
  // ===============================

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
    handleFetchCar(1, value, startDate, endDate);
  };

  const handleDateChange = ({ startDate: s, endDate: e }) => {
    setStartDate(s);
    setEndDate(e);
    setPage(1);
    handleFetchCar(1, search, s, e);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPage) return;
    setPage(newPage);
  };

  const handleDelete = async (id) => {
    const confirmDelete = await DeleteAlert(
      t("delete_confirm"),
      t("delete_success")
    );

    if (confirmDelete) {
      await axiosInstance.delete(APIPath.DELETE_CAR(id));
      handleFetchCar(page);
    }
  };

  const handleToDetailCar = (id) => {
    navigate(`/user/car-detail/${id}`);
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <SelectDate
          onSearch={handleSearch}
          placeholder={t("search_placeholder")}
          onDateChange={handleDateChange}
        />

        <div className="flex gap-3">
          <ExportExcelButton data={exportedData} />

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
              handleFetchCar(page)
            }
          />

          <button
            onClick={() => setShowAddCarForm(true)}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 text-white rounded-xl"
          >
            {t("add")}
          </button>
        </div>
      </div>

      {/* Desktop Card Layout */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {car.map((item, index) => (
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
          {car.map((item, index) => (
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

      {/* Pagination (style เดิม ไม่แตะ) */}
      <div className="flex justify-end mt-4 gap-2 items-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1 rounded ${page === 1
            ? "bg-gray-100 text-gray-400"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          ‹
        </button>

        {Array.from({ length: totalPage }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPage}
          className={`px-3 py-1 rounded ${page === totalPage
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
        handleFetchCar={() => handleFetchCar(page)}
      />

      <EditCarFormPopup
        show={showEditCarForm}
        onClose={() => setShowEditCarForm(false)}
        carId={carId}
        handleFetchCar={() => handleFetchCar(page)}
      />
    </div>
  );
};

export default CarList;