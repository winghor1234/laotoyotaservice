import React from "react";
import CurrencyInput from "react-currency-input-field";
import { usePoints } from "../../utils/PointContext";

const PointSetting = () => {
    const { pointSettings, setPointSettings } = usePoints();

    const handleUpdate = (field, value) => {
        setPointSettings((prev) => ({ ...prev, [field]: Number(value) || 0 }));
    };

    return (
        <div className="w-full min-h-screen bg-white p-6 sm:p-10 rounded-2xl border border-gray-100">
            {/* Header Section - Full Screen Width */}
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 gap-4">
                <div>
                    <h1 className="text-2xl  text-gray-900 tracking-tight flex items-center gap-3">
                        <span className="text-red-600">⚙️</span> ຕັ້ງຄ່າຄະແນນ
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Point System Configuration & Rules</p>
                </div>

                {/* ข้อความแนะนำย้ายมาไว้ด้านบนขวาเพื่อให้เข้ากับ Layout หน้าจอใหญ่ */}
                <div className="flex items-start gap-2.5 text-gray-400 max-w-md bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-base mt-0.5">💡</span>
                    <p className="text-xs leading-relaxed">
                        ຂໍ້ມູນນີ້ຈະຖືກນຳໃຊ້ເຂົ້າໃນການຄິດໄລ່ຄະແນນອັດຕະໂນມັດໃນໜ້າ <span className="text-gray-600 font-medium">ບັນທຶກການສ້ອມແປງ</span> ກະລຸນາກວດສອບໃຫ້ຖືກຕ້ອງກ່ອນບັນທຶກ.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Labour Section */}
                    <section className="space-y-4 bg-gray-50/40 p-6 rounded-2xl border border-gray-100/70">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="text-xs  text-red-600 tracking-wider uppercase bg-red-50 px-2 py-1 rounded">Labour</span>
                            <h2 className="text-base  text-gray-800">ເກນຄະແນນຄ່າແຮງ</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 ml-1">ຍອດເງິນ</label>
                                <div className="relative">
                                    <CurrencyInput
                                        value={pointSettings.labour_amount}
                                        onValueChange={(v) => handleUpdate("labour_amount", v)}
                                        className="w-full pl-4 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-800 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                                        groupSeparator=","
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">ກີບ</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 ml-1">ຈະໄດ້ຮັບຄະແນນ</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={pointSettings.labour_point}
                                        onChange={(e) => handleUpdate("labour_point", e.target.value)}
                                        className="w-full pl-4 pr-14 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-800 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-red-600">ຄະແນນ</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Part Section */}
                    <section className="space-y-4 bg-gray-50/40 p-6 rounded-2xl border border-gray-100/70">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="text-xs font-medium text-red-600 tracking-wider uppercase bg-red-50 px-2 py-1 rounded">Part</span>
                            <h2 className="text-base font-medium text-gray-800">ເກນຄະແນນຄ່າອາໄຫຼ່</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 ml-1">ຍອດເງິນ</label>
                                <div className="relative">
                                    <CurrencyInput
                                        value={pointSettings.part_amount}
                                        onValueChange={(v) => handleUpdate("part_amount", v)}
                                        className="w-full pl-4 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-800 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                                        groupSeparator=","
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">ກີບ</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 ml-1">ຈະໄດ້ຮັບຄະແນນ</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={pointSettings.part_point}
                                        onChange={(e) => handleUpdate("part_point", e.target.value)}
                                        className="w-full pl-4 pr-14 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-800 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-red-600">ຄະແນນ</span>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PointSetting;