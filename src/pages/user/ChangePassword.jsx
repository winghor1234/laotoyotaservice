import { SuccessAlert } from '../../utils/handleAlert/SuccessAlert';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useChangePasswordForm } from '../../component/schemaValidate/userValidate/ChangePassword';
import { useState } from 'react';


const ChangePassword = ({ show, onClose, customerId, handleFetch }) => {
    const { t } = useTranslation("user");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { register, handleSubmit, formState: { errors }, submitForm } = useChangePasswordForm({ customerId, handleFetch, onClose });

    return (
        <>
            {/* Dark overlay */}
            <div
                className={`fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity 
          ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Popup */}
            <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   z-50 w-full max-w-2xl bg-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 transition-all text-base   ${show ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}  >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div
                        onClick={onClose}
                        className="inline-flex items-center justify-center w-auto px-4 py-1 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer transition-colors mb-4">
                        <button className="flex items-center gap-2 text-gray-700 hover:text-black">
                            <FaArrowLeft className="text-sm sm:text-base" />
                            <span className="font-medium text-sm sm:text-lg lg:text-xl">{t("back")}</span>
                        </button>
                    </div>
                </div>
                <hr className="border-gray-300 border-1 w-full my-3" />

                {/* Form */}
                <form onSubmit={handleSubmit(submitForm)} className="space-y-4">

                    {/* New Password */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">
                            {t("new_password")}
                        </label>

                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder={t("new_password")}
                                {...register("newPassword")}
                                className="w-full h-[42px] border border-gray-300 rounded-lg px-3 pr-10 outline-none focus:border-blue-500"
                            />

                            {/* Eye icon */}
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                {showNew ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>


                        <div className='h-6'>
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">
                            {t("confirm_password")}
                        </label>

                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder={t("confirm_password")}
                                {...register("confirmPassword")}
                                className="w-full h-[42px] border border-gray-300 rounded-lg px-3 pr-10 outline-none focus:border-blue-500"
                            />

                            {/* Eye icon */}
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <div className='h-6'>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full h-[42px] bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
                    >
                        {t("change_password")}
                    </button>

                </form>
            </div>
        </>
    );
};

export default ChangePassword;