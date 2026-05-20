// import { useEditUserForm } from '../../component/schemaValidate/userValidate/EditUserValidate';
// import { SuccessAlert } from '../../utils/handleAlert/SuccessAlert';
// import { FaArrowLeft } from 'react-icons/fa';
// import { useTranslation } from 'react-i18next';

// const EditAdmin = ({ show, onClose, customerId, handleFetch }) => {
//   const { t } = useTranslation("user");
  // const { register, handleSubmit, formState: { errors }, submitForm } = useEditUserForm({ customerId, handleFetch, onClose });

//   return (
//     <>
//       {/* Dark overlay */}
//       <div
//         className={`fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity 
//           ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
//         onClick={onClose}
//       />

//       {/* Popup */}
//       <div
//         className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
//         z-50 w-full max-w-2xl bg-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 transition-all text-base 
//         ${show ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}
//       >
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//           <div
//             onClick={onClose}
//             className="inline-flex items-center justify-center w-auto px-4 py-1 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer transition-colors mb-4">
//             <button className="flex items-center gap-2 text-gray-700 hover:text-black">
//               <FaArrowLeft className="text-sm sm:text-base" />
//               <span className="font-medium text-sm sm:text-lg lg:text-xl">{t("back")}</span>
//             </button>
//           </div>
//         </div>
//         <hr className="border-gray-300 border-1 w-full my-3" />

//         {/* Form */}
//         <form onSubmit={handleSubmit(submitForm)} className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full p-3">
//           <div className="flex flex-col">
//             <label className="text-base font-medium mb-1">{t("username")}</label>
//             <input {...register("username")} className="w-full h-[40px] rounded-lg text-base font-light border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500" placeholder={t("username_placeholder")} />
//             {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
//           </div>

//           <div className="flex flex-col">
//             <label className="text-base font-medium mb-1">{t("phone")}</label>
//             <input {...register("phoneNumber")} className="w-full h-[40px] rounded-lg text-base font-light border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500" placeholder={t("phone_placeholder")} />
//             {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
//           </div>

//           <div className="flex flex-col">
//             <label className="text-base font-medium mb-1">{t("village")}</label>
//             <input {...register("village")} className="w-full h-[40px] rounded-lg text-base font-light border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500" placeholder={t("village_placeholder")} />
//             {errors.village && <p className="text-red-500 text-sm">{errors.village.message}</p>}
//           </div>

//           <div className="flex flex-col">
//             <label className="text-base font-medium mb-1">{t("district")}</label>
//             <input {...register("district")} className="w-full h-[40px] rounded-lg text-base font-light border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500" placeholder={t("district_placeholder")} />
//             {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
//           </div>

//           <div className="flex flex-col sm:col-span-2">
//             <label className="text-base font-medium mb-1">{t("province")}</label>
//             <input {...register("province")} className="w-full h-[40px] rounded-lg text-base font-light border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500" placeholder={t("province_placeholder")} />
//             {errors.province && <p className="text-red-500 text-sm">{errors.province.message}</p>}
//           </div>

//           <div className="flex flex-col">
//             <label className="text-base font-medium mb-1">{t("email")}</label>
//             <input {...register("email")} className="w-full h-[40px] rounded-lg text-base font-light border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500" placeholder={t("email_placeholder")} />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3 sm:col-span-2">
//             <button
//               type="button"
//               onClick={() => { onClose(); }}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10">
//               {t("cancel")}
//             </button>
//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10">
//               {t("confirm")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default EditAdmin;


import { FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { useEditAdminForm } from "../../component/schemaValidate/adminValidate/EditAdminValidate";

const EditAdmin = ({
  show,
  onClose,
  customerId,
  handleFetch,
}) => {
  const { t } =
    useTranslation("user");

  const {
    register,
    handleSubmit,

    errors,

    submitForm,
    loading,

    provinceOptions,
    districtOptions,

    selectedProvince,
    selectedDistrict,

    handleProvinceChange,
    handleDistrictChange,
  } = useEditAdminForm({
    customerId,
    handleFetch,
    onClose,
  });

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity duration-300 ${show
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 
                
                w-[95%] sm:w-[90%] md:w-full 
                max-w-2xl 
                max-h-[95vh] overflow-y-auto
                
                bg-gray-50 rounded-2xl shadow-lg 
                p-3 sm:p-4 md:p-6 
                
                transition-all duration-300 text-base ${show
            ? "scale-100 opacity-100"
            : "scale-90 opacity-0 pointer-events-none"
          }`}
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-3">

          {/* Back */}
          <div
            onClick={() =>
              onClose()
            }
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer transition-colors"
          >
            <button className="flex items-center gap-2 text-gray-700 hover:text-black">

              <FaArrowLeft className="text-sm sm:text-base" />

              <span className="font-medium text-sm sm:text-lg lg:text-xl">
                {t("back")}
              </span>
            </button>
          </div>
        </div>

        <hr className="border-gray-300 border-1 w-full my-3 sm:my-4" />

        {/* Form */}
        <form
          onSubmit={handleSubmit(
            submitForm
          )}
          className="flex flex-col justify-center gap-4 sm:gap-6"
        >
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-full w-full p-2 sm:p-3">

            {/* Username */}
            <div className="flex flex-col w-full">
              <label className="text-sm sm:text-base font-medium mb-1">
                {t("username")}
              </label>

              <input
                {...register(
                  "username"
                )}
                className="w-full h-[42px] sm:h-[45px] rounded-lg text-sm sm:text-base border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t(
                  "usernamePlaceholder"
                )}
              />

              <div className="h-5 sm:h-6">
                {errors?.username && (
                  <span className="text-red-500 text-xs sm:text-sm">
                    {
                      errors
                        .username
                        .message
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Province */}
            <div className="flex flex-col w-full">
              <label className="text-sm sm:text-base font-medium mb-1">
                {t("province")}
              </label>

              <Select
                options={
                  provinceOptions
                }
                value={
                  selectedProvince
                }
                onChange={
                  handleProvinceChange
                }
                placeholder={t(
                  "provincePlaceholder"
                )}
                isSearchable
                className="text-sm sm:text-base"
                menuPortalTarget={
                  document.body
                }
                styles={{
                  menuPortal:
                    (
                      base
                    ) => ({
                      ...base,
                      zIndex:
                        9999,
                    }),

                  control:
                    (
                      base
                    ) => ({
                      ...base,
                      minHeight:
                        42,
                      borderRadius:
                        8,
                    }),
                }}
              />

              <div className="h-5 sm:h-6">
                {errors?.province && (
                  <span className="text-red-500 text-xs sm:text-sm">
                    {
                      errors
                        .province
                        .message
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col w-full">
              <label className="text-sm sm:text-base font-medium mb-1">
                {t("phoneNumber")}
              </label>

              <input
                {...register(
                  "phoneNumber"
                )}
                className="w-full h-[42px] sm:h-[45px] rounded-lg text-sm sm:text-base border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t(
                  "phonePlaceholder"
                )}
              />

              <div className="h-5 sm:h-6">
                {errors?.phoneNumber && (
                  <span className="text-red-500 text-xs sm:text-sm">
                    {
                      errors
                        .phoneNumber
                        .message
                    }
                  </span>
                )}
              </div>
            </div>

            {/* District */}
            <div className="flex flex-col w-full">
              <label className="text-sm sm:text-base font-medium mb-1">
                {t("district")}
              </label>

              <Select
                options={
                  districtOptions
                }
                value={
                  selectedDistrict
                }
                onChange={
                  handleDistrictChange
                }
                placeholder={t(
                  "districtPlaceholder"
                )}
                isSearchable
                isDisabled={
                  !selectedProvince
                }
                className="text-sm sm:text-base"
                menuPortalTarget={
                  document.body
                }
                styles={{
                  menuPortal:
                    (
                      base
                    ) => ({
                      ...base,
                      zIndex:
                        9999,
                    }),

                  control:
                    (
                      base
                    ) => ({
                      ...base,
                      minHeight:
                        42,
                      borderRadius:
                        8,
                    }),
                }}
              />

              <div className="h-5 sm:h-6">
                {errors?.district && (
                  <span className="text-red-500 text-xs sm:text-sm">
                    {
                      errors
                        .district
                        .message
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col w-full">
              <label className="text-sm sm:text-base font-medium mb-1">
                {t("email")}
              </label>

              <input
                {...register(
                  "email"
                )}
                className="w-full h-[42px] sm:h-[45px] rounded-lg text-sm sm:text-base border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t(
                  "email_placeholder"
                )}
              />
            </div>

            {/* Village */}
            <div className="flex flex-col w-full">
              <label className="text-sm sm:text-base font-medium mb-1">
                {t("village")}
              </label>

              <input
                {...register(
                  "village"
                )}
                className="w-full h-[42px] sm:h-[45px] rounded-lg text-sm sm:text-base border border-gray-300 outline-none px-3 hover:border-blue-500 focus:border-blue-500 transition-colors"
                placeholder={t(
                  "villagePlaceholder"
                )}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 sm:gap-6 pt-4">

            <button
              type="button"
              onClick={() =>
                onClose()
              }
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-32 h-[42px] sm:h-10"
            >
              {t("cancel")}
            </button>

            <button
              disabled={
                loading
              }
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-32 h-[42px] sm:h-10"
            >
              {loading
                ? t(
                  "loading"
                )
                : t(
                  "confirm"
                )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditAdmin;
