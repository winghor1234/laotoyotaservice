import { FaArrowLeft, FaCar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";

import { useTranslation } from "react-i18next";

import { formatDates } from "../../../utils/FormatDate";

const CancelDetail = () => {
    const { id } = useParams();

    const navigate =
        useNavigate();

    const { t } =
        useTranslation(
            "booking"
        );

    const [data, setData] =
        useState({});

    useEffect(() => {
        const fetchAllData =
            async () => {
                try {
                    const Data =
                        await axiosInstance.get(
                            APIPath.SELECT_ONE_BOOKING(
                                id
                            )
                        );

                    const CancelData =
                        Data?.data
                            ?.data;

                    setData(
                        CancelData
                    );
                } catch (
                error
                ) {
                    console.error(
                        "Error fetching cancel data:",
                        error
                    );
                }
            };

        fetchAllData();
    }, [id]);

    return (
        <div
            className="
            border
            relative
            
            min-h-[500px]
            max-h-[95vh]
            overflow-y-auto
            
            bg-gray-50
            
            px-3 py-3
            sm:px-4 sm:py-4
            lg:px-6 lg:py-6
            
            max-w-7xl
            mx-auto
            
            rounded-2xl
            shadow-md
        "
        >
            {/* Back button */}
            <div
                onClick={() =>
                    navigate(
                        "/user/booking/cancel"
                    )
                }
                className="
                inline-flex
                items-center
                justify-center
                
                px-3 py-2
                sm:px-4
                
                bg-gray-200
                hover:bg-gray-300
                
                rounded-xl
                cursor-pointer
                transition-colors
                
                mb-4
            "
            >
                <button className="flex items-center gap-2 text-gray-700 hover:text-black">

                    <FaArrowLeft className="text-sm sm:text-base" />

                    <span className="font-medium text-sm sm:text-lg lg:text-xl">
                        {t("back")}
                    </span>
                </button>
            </div>

            <hr className="border-gray-300 border w-full" />

            {/* Title */}
            <h2
                className="
                text-center
                
                text-lg
                sm:text-xl
                lg:text-2xl
                
                font-medium
                
                my-4
            "
            >
                {t("cancelTitle")}
            </h2>

            {/* Content */}
            <div className="p-2 sm:p-4 rounded-lg">

                {/* Card Grid */}
                <div
                    className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    
                    gap-3
                    sm:gap-4
                "
                >
                    {/* Booking Info */}
                    <div
                        className="
                        bg-white
                        p-4
                        rounded-xl
                        shadow-sm
                        
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                    "
                    >
                        <FaCar className="text-3xl sm:text-4xl text-gray-700 mb-2" />

                        <span className="font-medium text-gray-500 text-xs sm:text-sm">
                            {t(
                                "bookingInfo"
                            )}
                        </span>
                    </div>

                    {/* Customer */}
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">

                        <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">
                            {t(
                                "customerName"
                            )}
                        </p>

                        <p className="text-gray-800 font-medium text-sm sm:text-base break-words">
                            {
                                data
                                    ?.user
                                    ?.username
                            }
                        </p>
                    </div>

                    {/* Phone */}
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">

                        <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">
                            {t("phone")}
                        </p>

                        <p className="text-gray-800 font-medium text-sm sm:text-base break-all">
                            {
                                data
                                    ?.user
                                    ?.phoneNumber
                            }
                        </p>
                    </div>

                    {/* Plate */}
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">

                        <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">
                            {t(
                                "plateNumber"
                            )}
                        </p>

                        <p className="text-gray-800 font-medium text-sm sm:text-base break-words">
                            {
                                data
                                    ?.car
                                    ?.plateNumber
                            }
                        </p>
                    </div>

                    {/* Model */}
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">

                        <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">
                            {t(
                                "carModel"
                            )}
                        </p>

                        <p className="text-gray-800 font-medium text-sm sm:text-base break-words">
                            {
                                data
                                    ?.car
                                    ?.model
                            }
                        </p>
                    </div>

                    {/* Zone */}
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">

                        <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">
                            {t("zone")}
                        </p>

                        <p className="text-gray-800 font-medium text-sm sm:text-base break-words">
                            {
                                data
                                    ?.zone
                                    ?.zoneName
                            }
                        </p>
                    </div>

                    {/* Date */}
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">

                        <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">
                            {t(
                                "date_label"
                            )}
                        </p>

                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                            {formatDates(
                                data?.day
                            )}
                        </p>
                    </div>

                    {/* Time */}
                    <div className="bg-white p-4 rounded-xl shadow-sm text-center">

                        <p className="font-medium text-gray-500 text-xs sm:text-sm mb-1">
                            {t(
                                "time_label"
                            )}
                        </p>

                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                            {
                                data
                                    ?.time
                                    ?.time
                            }
                        </p>
                    </div>
                </div>

                {/* Price Section */}
                <div
                    className="
                    bg-white
                    p-4
                    sm:p-5
                    
                    rounded-xl
                    shadow-sm
                    
                    mt-4
                "
                >
                    {/* Price Detail */}
                    <div
                        className="
                        flex
                        flex-col
                        gap-2
                        
                        text-center
                    "
                    >
                        <h1 className="text-sm sm:text-base text-gray-700">
                            {t(
                                "fixCarPrice"
                            )}
                            :{" "}
                            <span className="font-medium">
                                {data?.fixCarPrice ||
                                    0}{" "}
                                ກີບ
                            </span>
                        </h1>

                        <h1 className="text-sm sm:text-base text-gray-700">
                            {t(
                                "carPartPrice"
                            )}
                            :{" "}
                            <span className="font-medium">
                                {data?.carPartPrice ||
                                    0}{" "}
                                ກີບ
                            </span>
                        </h1>
                    </div>

                    {/* Total */}
                    <div
                        className="
                        flex
                        justify-center
                        
                        mt-4
                    "
                    >
                        <h1
                            className="
                            text-red-600
                            font-bold
                            
                            text-lg
                            sm:text-xl
                            lg:text-2xl
                            
                            text-center
                            break-words
                        "
                        >
                            {t(
                                "totalPrice"
                            )}
                            :{" "}
                            {data?.totalPrice ||
                                0}{" "}
                            ກີບ
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelDetail;