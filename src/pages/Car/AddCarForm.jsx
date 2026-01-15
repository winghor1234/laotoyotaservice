import { Car } from 'lucide-react';
import { SuccessAlert } from '../../utils/handleAlert/SuccessAlert';
import { FaArrowLeft } from 'react-icons/fa';
import { useAddCarForm } from '../../component/schemaValidate/carValidate/AddCarFormValidate';
import { useTranslation } from 'react-i18next';

export default function AddCarFormPopup({ show, onClose, handleFetchCar }) {
  const { register, handleSubmit, formState: { errors }, users = [], onSubmit, handleBack } = useAddCarForm({ handleFetchCar, onClose });
  const {t} = useTranslation("car"); 
  const fields = [
    { name: 'model', labelKey: 'model', placeholderKey: 'model_placeholder' },
    { name: 'engineNumber', labelKey: 'engine', placeholderKey: 'engine_placeholder' },
    { name: 'frameNumber', labelKey: 'frame', placeholderKey: 'frame_placeholder' },
    { name: 'plateNumber', labelKey: 'plate', placeholderKey: 'plate_placeholder' },
    { name: 'province', labelKey: 'province', placeholderKey: 'province_placeholder' },
    { name: 'color', labelKey: 'color', placeholderKey: 'color_placeholder' },
  ];

  return (
    <>
      {/* Background */}
      <div className={`fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none' }`} onClick={onClose}/>
      {/* Popup */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-50 rounded-2xl shadow-lg w-full max-w-3xl p-4 sm:p-6 text-sm transition-all ${show ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'  }`} >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div
            onClick={handleBack}
            className="inline-flex items-center justify-center w-auto px-4 py-1 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer transition-colors mb-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-black">
              <FaArrowLeft className="text-sm sm:text-base" />
              <span className="font-medium text-sm sm:text-lg lg:text-xl">{t("back")}</span>
            </button>
          </div>
        </div>
        <hr className="border-gray-300 border-1 w-full my-3" />

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:items-center lg:flex-row justify-center lg:justify-around gap-6 lg:gap-4"
        >
          {/* Left */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-full max-w-[250px] h-[150px] sm:h-[180px] lg:h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
              <Car className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] lg:w-[160px] lg:h-[160px] text-gray-600" />
            </div>
            <div className="flex flex-col gap-2 my-3 w-full max-w-[250px]">
              <button
                type="button"
                onClick={() => {
                  SuccessAlert(t("success_cancel"));
                  onClose();
                }}
                className="w-full py-2 border cursor-pointer border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                {t("cancel_add")}
              </button>
              <button
                type="submit"
                className="w-full py-2 border cursor-pointer border-red-500 rounded-lg text-sm bg-red-500 text-white hover:bg-[#E32121] transition-colors"
              >
                {t("add_car")}
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[400px] w-full">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">{t("customer_id")}</label>
              <select
                {...register('userId')}
                className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500"
              >
                <option value="">{t("choose_customer")}</option>
                {(users || []).map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.customer_number}
                  </option>
                ))}
              </select>
              {errors.userId && <span className="text-red-500 text-xs mt-1">{errors.userId.message}</span>}
            </div>

            {fields.map(({ name, labelKey, placeholderKey }) => (
              <div key={name} className="flex flex-col">
                <label className="text-sm font-medium mb-1">{t(labelKey)}</label>
                <input
                  {...register(name)}
                  placeholder={t(placeholderKey)}
                  className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors[name] && (
                  <span className="text-red-500 text-xs mt-1">{errors[name].message}</span>
                )}
              </div>
            ))}

          </div>
        </form>
      </div>
    </>
  );
}
