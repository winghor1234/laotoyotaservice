import React from "react";
import CurrencyInput from "react-currency-input-field";
import { usePoints } from "../../utils/PointContext";
import { Settings } from "lucide-react";

const PointSetting = () => {
    const { pointSettings, setPointSettings } = usePoints();

    const handleUpdate = (field, value) => {
        setPointSettings((prev) => ({
            ...prev,
            [field]: Number(value) || "",
        }));
    };

    return (
        <div className="w-full bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 ">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl text-gray-900 tracking-tight flex items-center gap-3">
                        <span className="text-red-600">
                            <Settings />
                        </span>
                        ຕັ້ງຄ່າຄະແນນ
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto mt-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Labour Section */}
                    <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-5 shadow-lg">
                        <div className="pb-3 border-b border-gray-100">
                            <h2 className="text-base text-gray-800">
                                ເກນຄະແນນຄ່າແຮງ
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Amount */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-500">
                                    ຍອດເງິນ
                                </label>

                                <div className="relative">
                                    <CurrencyInput
                                        value={pointSettings.labour_amount}
                                        onValueChange={(v) =>
                                            handleUpdate("labour_amount", v)
                                        }
                                        groupSeparator=","
                                        className="w-full pl-4 pr-14 py-3 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-800 outline-none transition-all focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                                        ກີບ
                                    </span>
                                </div>
                            </div>

                            {/* Point */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-500">
                                    ຈະໄດ້ຮັບຄະແນນ
                                </label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        value={pointSettings.labour_point}
                                        onChange={(e) =>
                                            handleUpdate(
                                                "labour_point",
                                                e.target.value
                                            )
                                        }
                                        className="w-full pl-4 pr-16 py-3 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-800 outline-none transition-all focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-red-600">
                                        ຄະແນນ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Part Section */}
                    <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-5 shadow-lg">
                        <div className="pb-3 border-b border-gray-100">
                            <h2 className="text-base text-gray-800">
                                ເກນຄະແນນຄ່າອາໄຫຼ່
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Amount */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-500">
                                    ຍອດເງິນ
                                </label>

                                <div className="relative">
                                    <CurrencyInput
                                        value={pointSettings.part_amount}
                                        onValueChange={(v) =>
                                            handleUpdate("part_amount", v)
                                        }
                                        groupSeparator=","
                                        className="w-full pl-4 pr-14 py-3 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-800 outline-none transition-all focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                                        ກີບ
                                    </span>
                                </div>
                            </div>

                            {/* Point */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-500">
                                    ຈະໄດ້ຮັບຄະແນນ
                                </label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        value={pointSettings.part_point}
                                        onChange={(e) =>
                                            handleUpdate(
                                                "part_point",
                                                e.target.value
                                            )
                                        }
                                        className="w-full pl-4 pr-16 py-3 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-800 outline-none transition-all focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-red-600">
                                        ຄະແນນ
                                    </span>
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