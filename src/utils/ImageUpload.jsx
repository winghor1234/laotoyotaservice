

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

const ImageUpload = ({ value, onChange, error, width = "w-72", height = "h-56" }) => {
    const [isDragging, setIsDragging] = useState(false);
        const { t } = useTranslation("util");
    const isFile = value instanceof File;
    const isFileList = value instanceof FileList && value.length > 0;
    const isUrl = typeof value === "string";

    const imageSrc = isFile
        ? URL.createObjectURL(value)
        : isFileList
            ? URL.createObjectURL(value[0])
            : isUrl
                ? value
                : null;

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) {
            onChange(e.dataTransfer.files);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.files?.length) {
            onChange(e.target.files);
        }
    };

    return (
        <div className="space-y-2">
            {imageSrc ? (
                <div className={`relative ${width} ${height} shadow-2xl`}>
                    <img
                        src={imageSrc}
                        alt="preview"
                        className="w-full h-full object-contain rounded-lg"
                    />
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg"
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("imageInput").click()}
                    className={`flex flex-col items-center justify-center ${width} ${height} border-2 border-dashed rounded-lg cursor-pointer transition ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                >
                    <Upload className="text-gray-400 w-8 h-8 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                        {t("drag_drop_click")}
                    </p>
                    <input
                        id="imageInput"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleInputChange}
                    />
                </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default ImageUpload;
