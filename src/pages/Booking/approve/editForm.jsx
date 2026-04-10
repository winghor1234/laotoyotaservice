
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { Clock3, MapPinned } from "lucide-react";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";


const EditForm = ({ setShowEdit, bookingId, fetchBooking }) => {
  const { t } = useTranslation("booking");
  const [booking, setBooking] = useState([]);
  const [zone, setZone] = useState([]);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, } = useForm({
    defaultValues: {
      zoneId: "",
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


        const zoneRes = await axiosInstance.get(
          APIPath.SELECT_ALL_ZONE
        );
        setZone(zoneRes?.data?.data);

      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, [bookingId]);

  // 🔥 Submit
  const onSubmit = async () => {
    try {
      const zoneId = watch("zoneId");
      if (!zoneId) return;

      const payload = {
        timeId: booking?.timeId,
        branchId: booking?.branchId,
        carId: booking?.carId,
        remark: booking?.remark,
        day: booking?.day,
        zoneId: zoneId,
      };

      await axiosInstance.put(
        APIPath.UPDATE_BOOKING(bookingId, payload),
        payload
      );
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

          <div className="w-full py-4 border border-gray-300 rounded-lg shadow-sm px-6">
            <div className="flex flex-col items-center gap-2 w-full">

              <MapPinned className="text-gray-600" />

              <p className="font-medium text-gray-600 text-sm">
                {t("zone_label")}
              </p>

              <select
                {...register("zoneId", { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

              {errors.zoneId && (
                <p className="text-red-500 text-sm">
                  {t("select_zone_required")}
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

