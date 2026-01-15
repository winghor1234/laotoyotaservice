import { BackButton } from "../../utils/BackButton";
import { ProfileUpdateForm } from "../../component/schemaValidate/authValidate/ProfileValidate";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UpdateProfile = () => {
  const { t } = useTranslation("auth");
  const { register, handleSubmit, formState: { errors }, submitForm, loading, setValue, preview, setPreview } = ProfileUpdateForm();

  return (
    <div className="max-w-md mx-auto p-6 shadow-md bg-white rounded-2xl">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">{t("update_profile_title")}</h2>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        {/* Username */}
        <div className="flex flex-col">
          <label>{t("username_label")}</label>
          <input
            type="text"
            {...register("username")}
            placeholder={t("username_placeholder")}
            className="w-full px-3 py-2 outline-none border focus:border-red-500 focus:caret-red-500 focus:text-red-500 rounded" />
          <div className="h-6">
            {errors.username && (<p className="text-red-500 text-sm">{errors.username.message}</p>)}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label>{t("email_label")}</label>
          <input
            type="email"
            {...register("email")}
            placeholder={t("email_placeholder")}
            className="w-full px-3 py-2 outline-none border focus:border-red-500 focus:caret-red-500 focus:text-red-500 rounded"
          />
          <div className="h-6">
            {errors.email && (<p className="text-red-500 text-sm">{errors.email.message}</p>)}
          </div>
        </div>

        {/* Province */}
        <div className="flex flex-col">
          <label>{t("province_label")}</label>
          <input
            type="text"
            {...register("province")}
            placeholder={t("province_placeholder")}
            className="w-full px-3 py-2 outline-none border focus:border-red-500 focus:caret-red-500 focus:text-red-500 rounded" />
          <div className="h-6">
            {errors.province && (<p className="text-red-500 text-sm">{errors.province.message}</p>)}
          </div>
        </div>

        {/* District */}
        <div className="flex flex-col">
          <label>{t("district_label")}</label>
          <input
            type="text"
            {...register("district")}
            placeholder={t("district_placeholder")}
            className="w-full px-3 py-2 outline-none border focus:border-red-500 focus:caret-red-500 focus:text-red-500 rounded" />
          <div className="h-6">
            {errors.district && (<p className="text-red-500 text-sm">{errors.district.message}</p>)}
          </div>
        </div>

        {/* Village */}
        <div className="flex flex-col">
          <label>{t("village_label")}</label>
          <input
            type="text"
            {...register("village")}
            placeholder={t("village_placeholder")}
            className="w-full px-3 py-2 outline-none border focus:border-red-500 focus:caret-red-500 focus:text-red-500 rounded" />
          <div className="h-6">
            {errors.village && (<p className="text-red-500 text-sm">{errors.village.message}</p>)}
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col justify-center items-center">
          <label>{t("profile_image_label")}</label>
          {preview ? (
            <div className="relative w-32 h-32 mb-2">
              <img
                src={preview}
                alt="profile"
                className="w-full h-full object-cover rounded-full border"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setValue("image", null);
                  setValue("removeImage", true);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                {t("delete_button")}
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 mb-2 flex items-center justify-center border rounded-full text-gray-400">
              {t("no_image")}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white cursor-pointer transition duration-150 ease-in-out rounded ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
        >
          {loading ? t("updating_profile") : t("update_profile_button")}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link
          to="/user/change-password"
          className="text-red-600 hover:text-red-500 font-medium cursor-pointer transition duration-150 ease-in-out"
        >
          {t("change_password_link")}
        </Link>
      </div>
    </div>
  );
};

export default UpdateProfile;
