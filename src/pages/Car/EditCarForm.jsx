import { Car } from "lucide-react";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import { FaArrowLeft } from "react-icons/fa";
import { useEditCarForm } from "../../component/schemaValidate/carValidate/EditCarFormValidate";
import { useTranslation } from "react-i18next";

const EditCarFormPopup = ({ show, onClose, carId, handleFetchCar }) => {
  const { t } = useTranslation("car");
  const { register, handleSubmit, submitForm, users,} = useEditCarForm({ carId, handleFetchCar, onClose });

  return (
    <>
      {/* Blur background */}
      <div
        className={`fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity ${
          show
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Popup */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-50 rounded-2xl shadow-lg w-full max-w-3xl p-4 sm:p-6 text-sm transition-all ${
          show
            ? "scale-100 opacity-100"
            : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div
            onClick={onClose}
            className="inline-flex items-center justify-center w-auto px-4 py-1 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer transition-colors mb-4"
          >
            <button className="flex items-center gap-2 text-gray-700 hover:text-black">
              <FaArrowLeft className="text-sm sm:text-base" />
              <span className="font-medium text-sm sm:text-lg lg:text-xl">
                {t("back")}
              </span>
            </button>
          </div>
        </div>
        <hr className="border-gray-300 border-1 w-full my-3" />

        {/* Main Content */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-col md:items-center lg:flex-row justify-center lg:justify-around gap-6 lg:gap-4"
        >
          {/* Left side - Car Image */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-full max-w-[250px] h-[150px] sm:h-[180px] lg:h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
              <Car className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] lg:w-[160px] lg:h-[160px] text-gray-600" />
            </div>
            <div className="flex flex-col gap-2 my-3 w-full max-w-[250px]">
              <button
                type="button"
                onClick={() => {
                  SuccessAlert(t("cancel_edit_alert"));
                  onClose();
                }}
                className="w-full py-2 border cursor-pointer border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                {t("cancel_edit")}
              </button>
              <button
                type="submit"
                className="w-full py-2 border cursor-pointer border-red-500 rounded-lg text-sm bg-red-500 text-white hover:bg-[#E32121] transition-colors"
              >
                {t("save_edit")}
              </button>
            </div>
          </div>

          {/* Right side - Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[400px] w-full">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                {t("customer_id")}
              </label>
              <select
                {...register("userId")}
                className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500 transition-colors"
              >
                {/* <option value="">{t("select_customer")}</option> */}
                {users.map((user) => (
                  <option key={user.user_id} value={String(user.user_id)}>
                    {user.customer_number} - {user.username}
                  </option>
                ))}
              </select>
              {/* {errors.userId && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.userId.message}
                </span>
              )} */}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">{t("car_model")}</label>
              <input
                {...register("model", { required: true })}
                className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t("car_model_placeholder")}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">{t("engine")}</label>
              <input
                {...register("engineNumber", { required: true })}
                className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t("engine_placeholder")}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">{t("frame")}</label>
              <input
                {...register("frameNumber", { required: true })}
                className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t("frame_placeholder")}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">{t("plate")}</label>
              <input
                {...register("plateNumber", { required: true })}
                className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t("plate_placeholder")}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">{t("province")}</label>
              <input
                {...register("province", { required: true })}
                className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t("province_placeholder")}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">{t("color")}</label>
              <input
                {...register("color", { required: true })}
                className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t("color_placeholder")}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCarFormPopup;
