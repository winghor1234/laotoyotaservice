
// export default PointSetting;
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Settings, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";

const pointSchema = z.object({
    priceFix: z.coerce.number().min(1),
    pricePart: z.coerce.number().min(1),
    pointFix: z.coerce.number().min(1),
    pointPart: z.coerce.number().min(1),
});

const fmt = (n) => Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

// ✅ ຍ້າຍອອກນອກ component ຫຼັກ — pure function, ບໍ່ໄດ້ໃຊ້ state ໃດໆຈາກ PointSetting
const buildRows = (price, point) => {
    const p = Number(price || 0);
    const pt = Number(point || 1);
    if (p <= 0 || pt <= 0) return [];
    const perPoint = p / pt; // ລາຄາຕໍ່ 1 ຄະແນນ
    return [1, 5, 10, 50, 100].map((pts) => ({
        spend: perPoint * pts,
        point: pts,
    }));
};

// ✅ ຍ້າຍອອກນອກ component ຫຼັກ — declare ຄັ້ງດຽວ, ບໍ່ຖືກສ້າງໃໝ່ທຸກ render
//    (ນີ້ແມ່ນສາເຫດຫຼັກທີ່ເຮັດໃຫ້ input ຫຼຸດ focus ທຸກຄັ້ງທີ່ພິມ)
const PricePointField = ({
    priceKey,
    pointKey,
    priceVal,
    pointVal,
    label,
    error1,
    error2,
    setValue,
}) => (
    <div className="p-4 bg-gray-50 rounded-xl space-y-2 border-2 border-red-500">
        <label className="font-medium">{label}</label>

        {/* Input Row */}
        <div className="flex items-center gap-2">
            {/* ລາຄາ */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-1 transition-all focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20

 ">
                <CurrencyInput
                    value={priceVal}
                    groupSeparator=","
                    onValueChange={(v) => setValue(priceKey, Number(v || 0))}
                    className="w-full p-3 outline-none bg-white"
                    placeholder="0"
                />
                <span className="px-3 py-3 bg-gray-100 text-gray-500 text-sm whitespace-nowrap border-l ">
                    ກີບ
                </span>
            </div>

            <span className="text-gray-400 font-medium">=</span>

            {/* ຄະແນນ */}
            <div className="flex items-center border rounded-lg overflow-hidden w-36 transition-all focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20
">
                <input
                    type="number"
                    min={1}
                    value={pointVal}
                    onChange={(e) => {
                        const v = e.target.value;
                        // ✅ ອະນຸຍາດໃຫ້ຫວ່າງໄດ້ຊົ່ວຄາວ, ບໍ່ບັງຄັບເປັນ 1 ທັນທີ
                        setValue(pointKey, v === "" ? "" : Number(v));
                    }}
                    onBlur={(e) => {
                        // ✅ ຄ່ອຍບັງຄັບ min 1 ຕອນອອກຈາກ field
                        if (e.target.value === "" || Number(e.target.value) < 1) {
                            setValue(pointKey, 1);
                        }
                    }}
                    className="w-full p-3 outline-none bg-white text-center"
                    placeholder="1"
                />
                <span className="px-3 py-3 bg-gray-100 text-gray-500 text-sm whitespace-nowrap border-l">
                    ຄະແນນ
                </span>
            </div>
        </div>

        {(error1 || error2) && (
            <p className="text-red-500 text-sm">
                {error1?.message || error2?.message}
            </p>
        )}

        {/* Preview Table */}
        {Number(priceVal) > 0 && Number(pointVal) > 0 && (
            <div className="mt-3 rounded-lg border overflow-hidden text-sm">
                <div className="bg-red-50 px-3 py-2 text-red-600 font-medium text-xs">
                    ທຸກໆ {fmt(priceVal)} ກີບ = {pointVal} ຄະແນນ
                    &nbsp;·&nbsp;
                    ({fmt(priceVal / pointVal)} ກີບ / 1 ຄະແນນ)
                </div>
                <table className="w-full">
                    <thead className="bg-gray-100 text-gray-500 text-xs">
                        <tr>
                            <th className="px-3 py-2 text-left">ຈ່າຍ (ກີບ)</th>
                            <th className="px-3 py-2 text-right">ໄດ້ຮັບ (ຄະແນນ)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {buildRows(priceVal, pointVal).map(({ spend, point }) => (
                            <tr key={point} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-gray-700">{fmt(spend)}</td>
                                <td className="px-3 py-2 text-right font-semibold text-red-600">
                                    {point} ຄະແນນ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

const PointSetting = () => {
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(pointSchema),
        defaultValues: {
            priceFix: 0,
            pricePart: 0,
            pointFix: 1, // default 1 ຄະແນນ
            pointPart: 1,
        },
    });

    const priceFix = watch("priceFix");
    const pricePart = watch("pricePart");
    const pointFix = watch("pointFix");
    const pointPart = watch("pointPart");

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const res = await axiosInstance.get(APIPath.GET_SETTING);
                const data = res?.data?.data;
                console.log("res : ",res);
                if (data) {
                    // setValue("priceFix", data.priceFix || 0);
                    // setValue("pricePart", data.pricePart || 0);
                    // setValue("pointFix", data.pointFix || 0);
                    // setValue("pointPart", data.pointPart || 0);
                    setValue("priceFix", (data.priceFix || 0) * pointFix);
                    setValue("pricePart", (data.pricePart || 0) * pointPart);
                    setValue("pointFix", pointFix);
                    setValue("pointPart", pointPart);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSetting();
    }, [setValue]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // ✅ ສົ່ງ backend ຄືເກົ່າ: priceFix = ລາຄາ ÷ ຄະແນນ
            const payload = {
                priceFix: data.priceFix / data.pointFix,
                pricePart: data.pricePart / data.pointPart,
                pointFix: data.pointFix,
                pointPart: data.pointPart,
            };

            const res = await axiosInstance.post(APIPath.CREATE_SETTING_POINT, payload);
            if (res.data) {
                SuccessAlert("ບັນທຶກສຳເລັດ", 1500, "success");
                reset(data);
            }
        } catch (error) {
            SuccessAlert(error?.response?.data?.message || "ບັນທຶກລົ້ມເຫຼວ", 2000, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full bg-white p-6 rounded-2xl border"
        >
            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="flex items-center gap-2 text-xl font-semibold">
                    <Settings className="text-red-600" />
                    ຕັ້ງຄ່າ Point
                </h1>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-xl"
                >
                    <Save size={18} />
                    {loading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
                </button>
            </div>

            {/* BODY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <PricePointField
                    label="ຄະແນນແຮງງານ"
                    priceKey="priceFix" priceVal={priceFix}
                    pointKey="pointFix" pointVal={pointFix}
                    error1={errors.priceFix} error2={errors.pointFix}
                    setValue={setValue}
                />
                <PricePointField
                    label="ຄະແນນອະໄຫຼ່"
                    priceKey="pricePart" priceVal={pricePart}
                    pointKey="pointPart" pointVal={pointPart}
                    error1={errors.pricePart} error2={errors.pointPart}
                    setValue={setValue}
                />
            </div>
        </form>
    );
};

export default PointSetting;