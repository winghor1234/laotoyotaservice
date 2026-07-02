import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { Clock3, MapPin, MapPinned, TimerIcon, X } from "lucide-react";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";


const EditForm = ({ setShowEdit, bookingId, fetchBooking }) => {
  const { t } = useTranslation("booking");
  const [booking, setBooking] = useState([]);
  const [zone, setZone] = useState([]);
  const [time, setTime] = useState([]);
  const [branch, setBranch] = useState([]);

  const [zoneSearch, setZoneSearch] = useState("");
  const [zoneShowDropdown, setZoneShowDropdown] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const zoneDropdownRef = useRef(null);

  const [timeSearch, setTimeSearch] = useState("");
  const [timeShowDropdown, setTimeShowDropdown] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const timeDropdownRef = useRef(null);

  const [branchSearch, setBranchSearch] = useState("");
  const [branchShowDropdown, setBranchShowDropdown] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const branchDropdownRef = useRef(null);

  const { register, handleSubmit, watch, reset, formState: { isSubmitting }, setValue } = useForm({
    defaultValues: {
      zoneId: "",
      timeId: booking?.time?.time_id,
      branchId: booking?.branchId,
    },
  });

  useEffect(() => {
    const init = async () => {
      try {
        const [bookingRes, zoneRes, timeRes, branchRes] = await Promise.all([
          axiosInstance.get(APIPath.SELECT_ONE_BOOKING(bookingId)),
          axiosInstance.get(APIPath.SELECT_ALL_ZONE),
          axiosInstance.get(APIPath.SELECT_ALL_TIME),
          axiosInstance.get(APIPath.SELECT_ALL_BRANCH)
        ]);

        const bookingData = bookingRes?.data?.data;
        const zones = zoneRes?.data?.data;
        const times = timeRes?.data?.data;
        const branches = branchRes?.data?.data;

        // อัปเดต List ข้อมูล
        setBooking(bookingData);
        setZone(zones);
        setTime(times);
        setBranch(branches);

        // 2. ตั้งค่าเริ่มต้นให้ React Hook Form
        if (bookingData) {
          reset({
            zoneId: bookingData.zoneId,
            timeId: bookingData.time?.time_id,
            branchId: bookingData.branchId,
          });

          // 3. สำคัญมาก: ตั้งค่าเริ่มต้นให้กับ Search Input ของคุณด้วย
          setZoneSearch(bookingData.zone?.zoneName || "");
          setTimeSearch(bookingData.time?.time || "");
          setBranchSearch(bookingData.branch?.branch_name || "");

          // เซ็ตตัวแปร Selected เพื่อไม่ให้ Dropdown เด้งขึ้นมาตอนโหลดเสร็จ
          setSelectedZone(zones.find(z => z.zone_id === bookingData.zoneId));
          setSelectedTime(times.find(t => t.time_id === bookingData.time?.time_id));
          setSelectedBranch(branches.find(b => b.branch_id === bookingData.branchId));
        }

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [bookingId, reset]);



  useEffect(() => {
    const handleClickOutside = (event) => {

      if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(event.target)) {
        setZoneShowDropdown(false);
      }

      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setTimeShowDropdown(false);
      }
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target)) {
        setBranchShowDropdown(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  // 🔥 Submit
  const onSubmit = async () => {
    try {
      const zoneId = watch("zoneId");
      const timeId = watch("timeId");
      const branchId = watch("branchId");
      if (!zoneId || !timeId) return;

      const payload = {
        timeId: timeId,
        branchId: branchId,
        carId: booking?.carId,
        remark: booking?.remark,
        day: booking?.day,
        zoneId: zoneId,
      };

      await axiosInstance.put(APIPath.UPDATE_BOOKING(bookingId, payload), payload);
      fetchBooking();
      SuccessAlert(t("edit_success"));
      setShowEdit(false);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white flex flex-col gap-6 p-6 rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto text-center">

        <h2 className="text-xl font-bold">
          {t("edit_booking_title")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div className="w-full flex justify-around items-center gap-4 py-4 border border-gray-300 rounded-lg shadow-sm px-6">

            <div ref={zoneDropdownRef} className="flex flex-col relative">
              <input type="hidden" {...register("zoneId")} />

              {/* input search */}
              <input
                type="text"
                value={zoneSearch}
                placeholder={t("select_zone")}
                onChange={(e) => {
                  setZoneSearch(e.target.value);
                  setSelectedZone(null);
                  setZoneShowDropdown(true);
                }}
                onFocus={() => {
                  if (!selectedZone) {
                    setZoneShowDropdown(true);
                  }
                }}
                className="w-full py-2 sm:py-3.5 rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-red-500 focus:border-red-500"
              />
              {/* ปุ่มสำหรับลบข้อมูล (แสดงเมื่อมีค่าใน search เท่านั้น) */}
              {zoneSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setZoneSearch("");
                    setValue("zoneId", "");
                    setSelectedZone(null);
                    setZoneShowDropdown(true);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X />
                </button>
              )}

              {/* dropdown */}
              {zoneShowDropdown && !selectedZone && (
                <div ref={zoneDropdownRef} className="absolute z-10 top-[65px] w-full bg-white border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto shadow">
                  {zone.filter((zone) => `${zone.zoneName}`.toLowerCase().includes(zoneSearch.toLowerCase()))
                    .map((zone) => (
                      <div
                        key={zone.zone_id}
                        onClick={() => {
                          setZoneSearch(`${zone.zoneName}`);
                          setSelectedZone(zone);
                          setValue("zoneId", zone.zone_id);
                          setZoneShowDropdown(false);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-red-600"
                      >
                        {zone.zoneName}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div ref={timeDropdownRef} className="flex flex-col relative">
              <input type="hidden" {...register("timeId")} />

              {/* input search */}
              <input
                type="text"
                value={timeSearch}
                placeholder={t("select_time")}
                onChange={(e) => {
                  setTimeSearch(e.target.value);
                  setSelectedTime(null);
                  setTimeShowDropdown(true);
                }}
                onFocus={() => {
                  if (!selectedTime) {
                    setTimeShowDropdown(true);
                  }
                }}
                className="w-full py-2 sm:py-3.5 rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-red-500 focus:border-red-500"
              />
              {/* ปุ่มสำหรับลบข้อมูล (แสดงเมื่อมีค่าใน search เท่านั้น) */}
              {timeSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setTimeSearch("");
                    setValue("timeId", "");
                    setSelectedTime(null);
                    setTimeShowDropdown(true);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X />
                </button>
              )}

              {/* dropdown */}
              {timeShowDropdown && !selectedTime && (
                <div ref={timeDropdownRef} className="absolute z-10 top-[65px] w-full bg-white border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto shadow">
                  {time.filter((time) => `${time.time}`.toLowerCase().includes(timeSearch.toLowerCase()))
                    .map((time) => (
                      <div
                        key={time.time_id}
                        onClick={() => {
                          setTimeSearch(`${time.time}`);
                          setSelectedTime(time);
                          setValue("timeId", time.time_id);
                          setTimeShowDropdown(false);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-red-600"
                      >
                        {time.time}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* branch */}
            {/* เพิ่มเงื่อนไขเช็คสิทธิ์ตรงนี้ */}
            <div
              ref={branchDropdownRef}
              className={`flex flex-col relative`}
            >
              <input type="hidden" {...register("branchId")} />

              {/* input search */}
              <input
                type="text"
                value={branchSearch}
                placeholder={t("select_branch")}
                onChange={(e) => {
                  setBranchSearch(e.target.value);
                  setSelectedBranch(null);
                  setBranchShowDropdown(true);
                }}
                onFocus={() => {
                  if (!selectedBranch) { // เช็คสิทธิ์ก่อนเปิด dropdown
                    setBranchShowDropdown(true);
                  }
                }}
                className={`w-full py-2 sm:py-3.5 rounded-lg text-sm border border-gray-300 px-3 outline-none transition-colors bg-gray-100"} 
    `}
              />

              {/* ปุ่มลบข้อมูล: แสดงเฉพาะเมื่อมีค่า และ ต้องเป็น super_admin เท่านั้น */}
              {branchSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setBranchSearch("");
                    setValue("branchId", "");
                    setSelectedBranch(null);
                    setBranchShowDropdown(true);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X />
                </button>
              )}

              {/* dropdown */}
              { branch && branchShowDropdown && !selectedBranch && (
                <div className="absolute z-10 top-[65px] w-full bg-white border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto shadow">
                  {branch
                    .filter((b) => `${b.branch_name}`.toLowerCase().includes(branchSearch.toLowerCase()))
                    .map((b) => (
                      <div
                        key={b.branch_id}
                        onClick={() => {
                          setBranchSearch(`${b.branch_name}`);
                          setSelectedBranch(b);
                          setValue("branchId", b.branch_id);
                          setBranchShowDropdown(false);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-red-600 hover:text-white"
                      >
                        {b.branch_name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              {t("cancel_button")}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {t("save_button")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditForm;




