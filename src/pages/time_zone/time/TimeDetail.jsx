import { Calendar, Clock3, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton } from "../../../utils/BackButton";
import EditTime from "./EditTime";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";

const TimeDetail = () => {
    const { t } = useTranslation("timeZone");
    const { id } = useParams();
    const [time, setTime] = useState([]);
    const [showEditTime, setShowEditTime] = useState(false);

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get(APIPath.SELECT_ONE_TIME(id));
            setTime(res?.data?.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="relative h-[470px] max-h-[470px] overflow-y-auto bg-gray-50 p-2 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6">
                    {/* Back Button */}
                    <BackButton />
                    <hr className="border-gray-300 w-full mb-4 sm:mb-6" />

                    {/* Title */}
                    <h2 className="text-center text-lg sm:text-xl lg:text-2xl font-medium mb-6 sm:mb-8">
                        {t("detail_time_title")}
                    </h2>

                    {/* Desktop/Tablet View */}
                    <div className="hidden md:block">
                        <div className="flex justify-center gap-10 text-sm lg:text-base font-medium text-gray-700">
                            <div className="flex flex-col items-center py-4 col-span-2 lg:col-span-1 gap-2">
                                <div className="flex gap-2 items-center">
                                    <Calendar className="text-2xl lg:text-4xl text-gray-700" />
                                    <span className="text-base lg:text-lg text-gray-500 text-center">{t("dateLabel")} :</span>
                                </div>
                                <p className="text-gray-900">{time?.date}</p>
                            </div>
                            <div className="space-y-3 py-4 flex flex-col items-center">
                                <div className="flex gap-2 items-center">
                                    <Clock3 className="text-2xl lg:text-4xl text-gray-700" />
                                    <span className="text-base lg:text-lg text-gray-500 text-center">{t("timeLabel")} :</span>
                                </div>
                                <p className="text-gray-900">{time?.time}</p>
                            </div>
                            <div className="space-y-3 py-4 flex flex-col items-center">
                                <div className="flex gap-2 items-center">
                                    <MapPinned className="text-2xl lg:text-4xl text-gray-700" />
                                    <span className="text-base lg:text-lg text-gray-500 text-center">{t("zoneLabel")} :</span>
                                </div>
                                <p className="text-gray-900">{time?.zone?.zoneName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center lg:justify-end">
                        <button
                            onClick={() => setShowEditTime(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full transition-colors font-medium text-sm lg:text-base w-full sm:w-auto"
                        >
                            {t("editButton")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Popup */}
            <EditTime show={showEditTime} onClose={() => setShowEditTime(false)} timeId={id} />
        </div>
    );
};

export default TimeDetail;
