import { FaUser, FaIdCard, FaCar, FaInfoCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import Spinner from "../../utils/Loading";
import { BackButton } from "../../utils/BackButton";

const DetailUser = () => {
    const { t } = useTranslation("user");
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ONE_USER(id));
                setUserData(res?.data?.data);
            } catch (error) {
                console.error("Error loading user details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" text={t("loading")} />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500 italic">
                <FaInfoCircle className="mr-2" /> {t("no_user_found")}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-6 font-lao">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* 1. ສ່ວນຂໍ້ມູນຜູ້ໃຊ້ */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <BackButton />
                    </div>

                    <div className="flex flex-col items-center border-b border-gray-50 pb-6 mb-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                            <FaUser className="text-4xl text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">{t("user_detail")}</h2>
                        <p className="text-red-600 font-semibold">{userData?.customer_number}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                        <InfoItem label={t("user_name")} value={userData?.username} />
                        <InfoItem label={t("user_email")} value={userData?.email} />
                        <InfoItem label={t("user_phone_number")} value={userData?.phoneNumber} />
                        <InfoItem label={t("user_address")} value={`${userData?.village || '-'}, ${userData?.district || '-'}, ${userData?.province || '-'}`} />
                    </div>
                </div>

                {/* 2. ສ່ວນສະແດງລາຍການບັດ (ຮອງຮັບຫຼາຍບັດ) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg  text-gray-800 flex items-center gap-2">
                            <FaIdCard className="text-red-500" />
                            {t("user_cards")}
                            <span className="ml-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-md text-sm">
                                {userData?.Card?.length || 0}
                            </span>
                        </h3>
                    </div>

                    {userData?.Card && userData.Card.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            {userData.Card.map((card) => (
                                <div
                                    key={card.card_id}
                                    onClick={() => setSelectedCard(card)}
                                    className="group relative bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-red-300 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                                            <FaIdCard className="text-xl" />
                                        </div>
                                        <span className="text-md uppercase tracking-wider font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                            {card.card_type }
                                        </span>
                                    </div>

                                    <h4 className="text-xs text-gray-400 font-medium mb-1 uppercase"> {t("card_number")}</h4>
                                    <p className="text-lg font-mono font-bold text-gray-800 mb-3 tracking-tighter">
                                        {formatCardNumber(card.card_number)}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <FaCar className="text-gray-400 text-sm" />
                                            <span className="text-sm font-semibold text-gray-700">
                                                {card.car?.plateNumber}
                                            </span>
                                        </div>
                                        <span className="text-xs text-red-600 font-medium"> {t("view_details")} →</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <FaIdCard className="mx-auto text-4xl text-gray-300 mb-3" />
                            <p className="text-gray-500">{t("user_card_not_found")}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Modal ລາຍລະອຽດບັດ ແລະ ລົດ */}
            {selectedCard && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-red-500 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FaIdCard className="text-2xl" />
                                <h2 className="text-xl font-bold">{t("car_and_card")}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                            {/* Card Details */}
                            <section>
                                <h3 className="text-md  text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                    {t("card_information")}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                                    <ModalInfo label={t("card_number")} value={selectedCard.card_number} primary />
                                    <ModalInfo label={t("vip_number")} value={selectedCard.vip_number} />
                                    <ModalInfo label={t("card_type")} value={selectedCard.card_type} />
                                    <ModalInfo label={t("active_point")} value={`${selectedCard.total_point || 0} ${t("point")}`} color="text-green-600" />
                                </div>
                            </section>

                            {/* Car Details */}
                            <section>
                                <h3 className="text-md  text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                    {t("car_information")}
                                </h3>
                                {selectedCard.car ? (
                                    <div className="grid grid-cols-2 gap-4 bg-blue-50/30 p-4 rounded-2xl border border-blue-50">
                                        <ModalInfo label={t("car_model")} value={selectedCard.car.model} />
                                        <ModalInfo label={t("plate_number")} value={selectedCard.car.plateNumber} primary />
                                        <ModalInfo label={t("province")} value={selectedCard.car.province} />
                                        <ModalInfo label={t("car_color")} value={selectedCard.car.color} />
                                        <ModalInfo label={t("engine_number")} value={` ${selectedCard.car.engineNumber}`} />
                                        <ModalInfo label={t("frame_number")} value={`${selectedCard.car.frameNumber} `} />
                                        {/* <div className="col-span-2">
                                        </div> */}
                                    </div>
                                ) : (
                                    <p className="text-sm text-center text-gray-400 py-4 bg-gray-50 rounded-xl italic">
                                        {t("not_found_car_in_card")}
                                    </p>
                                )}
                            </section>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="w-full sm:w-auto px-8 py-3 bg-gray-800 text-white rounded-xl  hover:bg-gray-700 transition-all active:scale-95"
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components ເພື່ອຄວາມເປັນລະບຽບ
const InfoItem = ({ label, value }) => (
    <div className="flex flex-col justify-center items-center">
        <span className="text-md text-gray-400  mb-1 uppercase tracking-tighter">{label}</span>
        <span className="text-gray-800 ">{value || '-'}</span>
    </div>
);

const ModalInfo = ({ label, value, primary, color }) => (
    <div className="flex flex-col">
        <span className="text-md text-gray-400  uppercase">{label}</span>
        <span className={`${primary ? 'text-base ' : 'text-md '} ${color || 'text-gray-700'}`}>
            {value || '-'}
        </span>
    </div>
);

// Helper function ຈັດ format ເລກບັດໃຫ້ເບິ່ງງ່າຍ (ເຊັ່ນ: 0000 0000)
const formatCardNumber = (num) => {
    if (!num) return '---- ----';
    return num.toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ");
};

export default DetailUser;