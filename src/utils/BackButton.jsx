import { useTranslation } from "react-i18next"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
export const BackButton = () => {
    const navigate = useNavigate()
    const { t } = useTranslation("util")
    const handleBack = () => {
        navigate(-1)
    }
    return (
        <div
            onClick={handleBack}
            className="inline-flex items-center justify-center w-auto px-4 py-1 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer transition-colors mb-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-black">
                <FaArrowLeft className="text-sm sm:text-base" />
                <span className="font-medium text-sm sm:text-lg lg:text-xl">{t("back")}</span>
            </button>
        </div>
    )
}