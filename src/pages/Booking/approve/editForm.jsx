
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { Clock3 } from "lucide-react";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";

const EditForm = ({ setShowEdit, bookingId, reload }) => {
  const { t } = useTranslation("booking");

  const [timesList, setTimesList] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booking, setBooking] = useState(null);

  const { register,handleSubmit,reset,watch,formState: { errors, isSubmitting },} = useForm({
    defaultValues: {
      timeId: "",
    },
  });

  // 🔥 Load initial data
  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ fetch booking
        const bookingRes = await axiosInstance.get(
          APIPath.SELECT_ONE_BOOKING(bookingId)
        );

        const bookingData = bookingRes?.data?.data;
        setBooking(bookingData);

        // set default timeId
        reset({
          timeId: bookingData?.timeId?.toString() || "",
        });

        // 2️⃣ fetch all times
        const timesRes = await axiosInstance.get(
          APIPath.SELECT_ALL_TIME
        );

        setTimesList(timesRes?.data?.data || []);

        // 3️⃣ fetch selected time info (for zone display)
        if (bookingData?.timeId) {
          const timeRes = await axiosInstance.get(
            APIPath.SELECT_ONE_TIME(bookingData.timeId)
          );
          setSelectedTime(timeRes?.data?.data);
        }

      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, [bookingId, reset]);

  // 🔥 watch time change → update zone instantly
  const watchTimeId = watch("timeId");

  useEffect(() => {
    const fetchSelectedTime = async () => {
      try {
        if (!watchTimeId) return;

        const res = await axiosInstance.get(
          APIPath.SELECT_ONE_TIME(watchTimeId)
        );

        setSelectedTime(res?.data?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSelectedTime();
  }, [watchTimeId]);

  // 🔥 Submit
  const onSubmit = async () => {
    try {
      if (!selectedTime) return;
      const payload = {
        timeId: selectedTime.time_id,
        branchId: selectedTime.branchId,
        carId: booking?.carId,
        remark: booking?.remark,
      };

      await axiosInstance.put(
        APIPath.UPDATE_BOOKING(bookingId),
        payload
      );

      SuccessAlert(t("edit_success"));

      // reload parent data (zone will refresh correctly)
      await reload();

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

          <div className="w-full py-4 border border-gray-300 rounded-lg shadow-sm px-6">
            <div className="flex flex-col items-center gap-2 w-full">

              <Clock3 className="text-gray-600" />

              <p className="font-medium text-gray-600 text-sm">
                {t("time_label")}
              </p>

              <select
                {...register("timeId", { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {timesList.filter((item) => item.timeStatus === true).map(item => (
                  <option
                    key={item.time_id}
                    value={item.time_id}
                  >
                    ເວລາ:{item.time} /
                    ວັນທີ:{item.date} /
                    ສາຂາ:{item.branch?.branch_name} /
                    ໂຊນ:{item.zone?.zoneName}
                  </option>
                ))}
              </select>

              {errors.timeId && (
                <p className="text-red-500 text-sm">
                  {t("select_time_required")}
                </p>
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
