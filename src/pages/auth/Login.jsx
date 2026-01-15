import { Eye, EyeOff, Lock, Phone } from 'lucide-react';
import { useLoginForm } from '../../component/schemaValidate/authValidate/LoginValidate';
import { useTranslation } from "react-i18next";
import LanguageToggle from '../../utils/LanguageToggle';

const Login = () => {
    const { showPassword, setShowPassword, loading, register, handleSubmit, formState: { errors }, submitForm } = useLoginForm();
    const { t } = useTranslation("auth");

    return (
        <div className="max-w-md w-full space-y-8 shadow-lg p-8 bg-white rounded">
            <div className='flex justify-end items-start'>
                <LanguageToggle />
            </div>
            <div>
                <div className="mx-auto h-20 w-20 flex items-center justify-center">
                    <img src="/src/assets/logo.jpg" alt="Lao Toyota" className="h-16 w-auto rounded " />
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    {t("login_title")}
                </h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitForm)}>
                <div className="space-y-4">
                    {/* Phone Input */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            {t("phone")}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="phone"
                                {...register('phoneNumber')}
                                type="number"
                                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder={t("phone_placeholder")}
                            />
                        </div>
                        <div className='mt-1 h-7'>
                            {errors.phoneNumber && <p className="text-red-500 text-xs ">{errors.phoneNumber.message}</p>}
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            {t("password")}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>

                            <div className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus-within:ring-red-500 focus-within:border-red-500 focus-within:z-10 sm:text-sm focus-within:caret-red-500">
                                <input
                                    id="password"
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    className='w-full outline-none border-none '
                                    placeholder={t("password_placeholder")}
                                />
                            </div>
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 " />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <div className='mt-1 h-7'>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Remember me and forgot password 
                <div className="flex items-center justify-end">
                    <div className="text-sm">
                        <a href="/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                            {t("forgot_password")}
                        </a>
                    </div>
                </div>*/}

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading
                            ? 'bg-red-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                            } transition duration-150 ease-in-out`}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t("logging_in")}
                            </div>
                        ) : (
                            t("login_button")
                        )}
                    </button>
                </div>

                {/* Sign up link 
                <div className="text-center">
                    <span className="text-sm text-gray-600">
                        {t("no_account")}{" "}
                        <a href="/register" className="font-medium text-red-600 hover:text-red-500">
                            {t("register_here")}
                        </a>
                    </span>
                </div>*/}
            </form>
        </div>
    );
};

export default Login;
