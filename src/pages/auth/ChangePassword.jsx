import { BackButton } from "../../utils/BackButton";
import { ChangePasswordForm } from "../../component/schemaValidate/authValidate/ChangePasswordValidate";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const { t } = useTranslation("auth");
  const { register, handleSubmit, formState: { errors }, submitForm, loading, } = ChangePasswordForm();

  return (
    <div className="max-w-md mx-auto p-6 shadow-md bg-white rounded-2xl">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">{t("change_password_title")}</h2>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        {/* Old Password */}
        <div className="flex flex-col">
          <input
            {...register("oldPassword")}
            type="password"
            placeholder={t("old_password_placeholder")}
            className="w-full px-3 py-2 border rounded outline-none focus:border-red-500 focus:caret-red-500 focus:text-red-500"
          />
          <div className="h-6">
            {errors.oldPassword && (
              <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
            )}
          </div>
        </div>

        {/* New Password */}
        <div className="flex flex-col">
          <input
            {...register("newPassword")}
            type="password"
            placeholder={t("new_password_placeholder")}
            className="w-full px-3 py-2 border rounded outline-none focus:border-red-500 focus:caret-red-500 focus:text-red-500"
          />
          <div className="h-6">
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white rounded ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
        >
          {loading ? t("changing_password") : t("change_password_button")}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
