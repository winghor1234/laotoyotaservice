import { useTranslation } from "react-i18next";


const DownloadButton = ({setOpen}) => {
    const { t } = useTranslation("util");
  return (
    <div>
      <button onClick={() => setOpen(true)} className="flex items-center bg-gray-600 hover:bg-gray-700 text-white rounded gap-2 px-3 py-3.5 mx-2">
          {t("export_button")}
        </button>
    </div>
  )
}

export default DownloadButton
