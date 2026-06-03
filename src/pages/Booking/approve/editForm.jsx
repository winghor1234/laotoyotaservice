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

  //  Load initial data
  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       // 1️⃣ fetch booking
  //       const bookingRes = await axiosInstance.get(APIPath.SELECT_ONE_BOOKING(bookingId));
  //       const bookingData = bookingRes?.data?.data;
  //       setBooking(bookingData);


  //       const zoneRes = await axiosInstance.get(APIPath.SELECT_ALL_ZONE);
  //       setZone(zoneRes?.data?.data);

  //       const timeRes = await axiosInstance.get(APIPath.SELECT_ALL_TIME);
  //       setTime(timeRes?.data?.data);

  //       const branchRes = await axiosInstance.get(APIPath.SELECT_ALL_BRANCH);
  //       // console.log("branch : ",branchRes?.data?.data);
  //       setBranch(branchRes?.data?.data);

  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (booking?.time?.time_id) {
  //     reset({
  //       zoneId: booking.zoneId,
  //       timeId: booking.time.time_id, // ✅ ค่าเดิม
  //     });
  //   }

  //   init();
  // }, [bookingId, reset]);


  // 1. ปรับ useEffect การโหลดข้อมูลใหม่
  useEffect(() => {
    const init = async () => {
      try {
        // ดึงข้อมูลทั้งหมดพร้อมกันเพื่อความเร็ว
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
            {/* <div className="flex flex-col items-center gap-2 w-full">

              <MapPinned className="text-gray-600" />

              <p className="font-medium text-gray-600 text-sm">
                {t("zone_label")}
              </p>

              <select
                {...register("zoneId", { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 outline-none focus:ring-1 focus:ring-red-500 bg-white"
              >
                {zone?.map(item => (
                  <option
                    key={item.zone_id}
                    value={item.zone_id}
                  >
                    {item.zoneName}
                  </option>
                ))}
              </select>

              <div className="h-6">
                {errors.zoneId && (
                  <p className="text-red-500 text-sm">
                    {t("select_zone_required")}
                  </p>
                )}
              </div>

            </div> */}
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
            {/* <div className="flex flex-col items-center gap-2 w-full">
              <TimerIcon className="text-gray-600" />
              <p className="font-medium text-gray-600 text-sm">
                {t("time_label")}
              </p>

              <select
                {...register("timeId", { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 outline-none focus:ring-1 focus:ring-red-500 bg-white"
              >
                {time?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))?.map(item => (
                  <option
                    key={item.time_id}
                    value={item.time_id}
                  >
                    {item.time}
                  </option>
                ))}
              </select>


              <div className="h-6">
                {errors.timeId && (
                  <p className="text-red-500 text-sm">
                    {t("select_time_required")}
                  </p>
                )}
              </div>

            </div> */}

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
            {/* <div className="flex flex-col items-center gap-2 w-full">
              <MapPin className="text-gray-600" />
              <p className="font-medium text-gray-600 text-sm">
                {t("branch_label")}
              </p>

              <select
                {...register("branchId", { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 outline-none focus:ring-1 focus:ring-red-500 bg-white"
              >
                {branch?.map(item => (
                  <option
                    key={item.branch_id}
                    value={item.branch_id}
                  >
                    {item.branch_name}
                  </option>
                ))}
              </select>


              <div className="h-6">
                {errors.branchId && (
                  <p className="text-red-500 text-sm">
                    {t("select_branch_required")}
                  </p>
                )}
              </div>

            </div> */}

            <div ref={branchDropdownRef} className="flex flex-col relative">
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
                  if (!selectedBranch) {
                    setBranchShowDropdown(true);
                  }
                }}
                className="w-full py-2 sm:py-3.5 rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-red-500 focus:border-red-500"
              />
              {/* ปุ่มสำหรับลบข้อมูล (แสดงเมื่อมีค่าใน search เท่านั้น) */}
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
              {branchShowDropdown && !selectedBranch && (
                <div ref={branchDropdownRef} className="absolute z-10 top-[65px] w-full bg-white border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto shadow">
                  {branch.filter((branch) => `${branch.branch_name}`.toLowerCase().includes(branchSearch.toLowerCase()))
                    .map((branch) => (
                      <div
                        key={branch.branch_id}
                        onClick={() => {
                          setBranchSearch(`${branch.branch_name}`);

                          setSelectedBranch(branch);
                          setValue("branchId", branch.branch_id);
                          setBranchShowDropdown(false);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-red-600"
                      >
                        {branch.branch_name}
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




