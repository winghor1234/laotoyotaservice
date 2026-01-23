import { Car, Edit, Trash } from "lucide-react";
import AddCarFormPopup from "./AddCarForm";
import SelectDate from "../../utils/SelectDate";
import { useEffect, useState } from "react";
import EditCarFormPopup from "./EditCarForm";
import { DeleteAlert } from "../../utils/handleAlert/DeleteAlert";
import { filterByDateRange } from "../../utils/FilterDate";
import { filterSearch } from "../../utils/FilterSearch";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import ExportExcelButton from "../../utils/ExcelExportButton";
import { useTranslation } from "react-i18next";
import ImportExcel from "../../utils/ImportExel";

const CarList = () => {
  const { t } = useTranslation("car");
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [showEditCarForm, setShowEditCarForm] = useState(false);
  const [carId, setCarId] = useState(null);
  const [car, setCar] = useState([]);
  const [userId, setUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [exportedData, setExportedData] = useState([]);

  const handleFetchCar = async () => {
    try {
      const [resAllCar, resGetUserId] = await Promise.all([
        axiosInstance.get(APIPath.SELECT_ALL_CAR),
        axiosInstance.get(APIPath.GET_PROFILE),
      ]);
      setCar(resAllCar?.data?.data);
      // console.log(resAllCar?.data?.data);
      setUserId(resGetUserId?.data?.data?.user_id);
      setExportedData(
        resAllCar?.data?.data?.map((item) => ({
          // [t("userId")]: item.userId,
          // [t("model")]: item.model,
          // [t("plate")]: item.plateNumber,
          // [t("frame")]: item.frameNumber,
          // [t("engine")]: item.engineNumber,
          // [t("province")]: item.province,
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

  const handleDelete = async (carId) => {
    try {
      const confirmDelete = await DeleteAlert(t("delete_confirm"), t("delete_success"));
      if (confirmDelete) {
        await axiosInstance.delete(APIPath.DELETE_CAR(carId));
        handleFetchCar();
      }
    } catch (error) {
      console.error("Failed to delete car:", error);
    }
  };

  useEffect(() => {
    handleFetchCar();
  }, []);

  const filteredCar = filterByDateRange( filterSearch(car, "plateNumber", search), startDate, endDate, "createdAt" );

  return (
    <div>
      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 mb-6">
        <SelectDate onSearch={setSearch} placeholder={t("search_placeholder")} onDateChange={({ startDate, endDate }) => { setStartDate(startDate); setEndDate(endDate); }} />
        <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-3">
          <button className="bg-red-600 hover:bg-red-700 transition-colors w-full sm:w-auto px-6 py-2.5 sm:py-3 text-white rounded-xl font-medium">
            {t("search")}
          </button>
          <ExportExcelButton data={exportedData} />
          {/*  ImportExcel */}
          <ImportExcel
            apiPath={APIPath.CREATE_CAR}
            requiredFields={[ "ລະຫັດ", "ຊື່ລົດ", "ປ້າຍທະບຽນ", "ເລກຖັງ", "ເລກຈັກ", "ແຂວງ",'ສີ' ]}
            transformData={(item) => ({
              userId: item["ລະຫັດ"],
              model: item["ຊື່ລົດ"],
              plateNumber: item["ປ້າຍທະບຽນ"],
              frameNumber: item["ເລກຖັງ"],
              engineNumber: item["ເລກຈັກ"],
              province: item["ແຂວງ"],
              color: item['ສີ']
            })}
            onUploadSuccess={handleFetchCar}
          />
          <button
            onClick={() => setShowAddCarForm(true)}
            className="bg-blue-500 hover:bg-blue-600 transition-colors w-full sm:w-auto px-6 py-2.5 sm:py-3 text-white rounded-xl font-medium"
          >
            {t("add")}
          </button>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
        <div className="hidden md:block w-full h-12 md:h-14 lg:h-16 bg-[#E52020] text-white">
          <div className="grid grid-cols-8 gap-2 md:gap-4 px-3 md:px-4 lg:px-6 py-3 font-medium text-sm md:text-base lg:text-lg">
            <div className="flex justify-center items-center">{t("index")}</div>
            <div className="flex justify-center items-center">{t("model")}</div>
            <div className="flex justify-center items-center">{t("plate")}</div>
            <div className="flex justify-center items-center">{t("color")}</div>
            <div className="flex justify-center items-center">{t("engine")}</div>
            <div className="flex justify-center items-center">{t("frame")}</div>
            <div className="flex justify-center items-center">{t("province")}</div>
            <div className="flex justify-center items-center">{t("action")}</div>
          </div>
        </div>
        <div className="hidden md:block divide-y divide-gray-200 overflow-auto max-h-[400px]">
          {filteredCar?.map((item, index) => (
            <div key={index} className="grid grid-cols-8 gap-1 px-3 py-3 items-center hover:bg-gray-50">
              <div className="flex justify-center">{index + 1}</div>
              <div className="text-center line-clamp-1 ">{item.model}</div>
              <div className="text-center line-clamp-1">{item.plateNumber}</div>
                <div className="text-center line-clamp-1">{item.color}</div>
              <div className="text-center line-clamp-1">{item.engineNumber}</div>
              <div className="text-center line-clamp-1">{item.frameNumber}</div>
              <div className="text-center line-clamp-1">{item.province}</div>
              <div className="flex justify-center gap-6">
                <Edit className="cursor-pointer" onClick={() => { setShowEditCarForm(true); setCarId(item.car_id); }} />
                <Trash onClick={() => handleDelete(item.car_id)} className="cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-gray-200">
          {car?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Car className="text-gray-600 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{item.model}</h3>
                  <p className="text-gray-600 text-base line-clamp-1">{item.plateNumber}</p>
                </div>
              </div>
              <div className="grid gap-2 text-base">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">{t("engine")}:</span>
                  <span>{item.engineNumber}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">{t("frame")}:</span>
                  <span>{item.frameNumber}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">{t("plate")}:</span>
                  <span>{item.plateNumber}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">{t("province")}:</span>
                  <span>{item.province}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Popups */}
      <AddCarFormPopup show={showAddCarForm}  onClose={() => setShowAddCarForm(false)}  handleFetchCar={handleFetchCar}/>
      <EditCarFormPopup  show={showEditCarForm}  onClose={() => setShowEditCarForm(false)}  userId={userId}  carId={carId}  handleFetchCar={handleFetchCar}  />
    </div>
  );
};

export default CarList;
