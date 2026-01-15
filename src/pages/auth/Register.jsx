import { Eye, EyeOff, User, Mail, Lock, MapPin, Phone } from 'lucide-react';
import { registerSchema, useRegisterForm } from '../../component/schemaValidate/authValidate/RegisterValidate';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../../utils/LanguageToggle';

const Register = () => {
    const { t } = useTranslation("auth"); // ✅ ใช้ i18n
    const { showPassword, setShowPassword, loading, register, handleSubmit, formState: { errors }, submitForm } = useRegisterForm(registerSchema);

    return (
        <div className="max-w-md w-full bg-white rounded-lg space-y-8 shadow-lg p-8">
            <div className='flex justify-end items-start'>
                <LanguageToggle />
            </div>
            <div className="mx-auto h-20 w-20 flex items-center justify-center">
                <img src="/src/assets/logo.jpg" alt="Lao Toyota" className="h-16 w-auto rounded-full" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                {t("register_title")}
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitForm)}>
                <div className="space-y-4">
                    {/* Username */}
                    <div className='flex flex-col'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("username_label")}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register("username")}
                                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder={t("username_placeholder")}
                            />
                        </div>
                        <div className='h-6'>{errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}</div>
                    </div>

                    {/* Phone */}
                    <div className='flex flex-col'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("phone")}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex mt-3 pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus-within:ring-red-500 focus-within:border-red-500 focus-within:z-10 sm:text-sm focus-within:caret-red-500">
                                <input
                                    {...register("phoneNumber")}
                                    className='w-full outline-none border-none focus:text-red-500'
                                    placeholder={t("phone_placeholder")}
                                />
                            </div>
                            <div className='h-6'>{errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}</div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className='flex flex-col'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("password")}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex mt-3 pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus-within:ring-red-500 focus-within:border-red-500 focus-within:z-10 sm:text-sm focus-within:caret-red-500">
                                <input
                                    {...register("password")}
                                    type={showPassword ? 'text' : 'password'}
                                    className='w-full outline-none border-none focus:text-red-500'
                                    placeholder={t("password_placeholder")}
                                />
                            </div>
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex mt-3.5 hover:cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                            <div className='h-6'>{errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}</div>
                        </div>
                    </div>

                    {/* Province */}
                    <div className='flex flex-col'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("province_label")}</label>
                        <input {...register("province")} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm" placeholder={t("province_placeholder")} />
                        <div className='h-6'>{errors.province && <p className="text-red-500 text-sm">{errors.province.message}</p>}</div>
                    </div>

                    {/* District */}
                    <div className='flex flex-col'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("district_label")}</label>
                        <input {...register("district")} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm" placeholder={t("district_placeholder")} />
                        <div className='h-6'>{errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}</div>
                    </div>

                    {/* Village */}
                    <div className='flex flex-col'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("village_label")}</label>
                        <input {...register("village")} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm" placeholder={t("village_placeholder")} />
                        <div className='h-6'>{errors.village && <p className="text-red-500 text-sm">{errors.village.message}</p>}</div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button type="submit" disabled={loading} className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'} transition duration-150 ease-in-out`}>
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t("register_loading")}
                                </div>
                            ) : t("register_button")}
                        </button>
                    </div>
                </div>
            </form>

            {/* Login link */}
            <div className="text-center">
                <span className="text-sm text-gray-600">
                    {t("already_have_account")}{" "}
                    <a href="/" className="font-medium text-red-600 hover:text-red-500">{t("login_here")}</a>
                </span>
            </div>
        </div>
    );
};

export default Register;
