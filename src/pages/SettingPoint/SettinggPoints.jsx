// import { useEffect, useState } from "react";
// import CurrencyInput from "react-currency-input-field";
// import { Settings, Save } from "lucide-react";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// import axiosInstance from "../../utils/AxiosInstance";
// import APIPath from "../../api/APIPath";
// import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";

// /* schema */
// const pointSchema = z.object({
//     priceFix: z.coerce.number().min(1),
//     pricePart: z.coerce.number().min(1),
// });

// const PointSetting = () => {
//     const [loading, setLoading] = useState(false);

//     const {
//         handleSubmit,
//         watch,
//         setValue,
//         reset,
//         formState: { errors },
//     } = useForm({
//         resolver: zodResolver(pointSchema),
//         defaultValues: {
//             priceFix: 0,
//             pricePart: 0,
//         },
//     });

//     /* ======================
//        GET DATA
//     ======================= */
//     useEffect(() => {
//         const fetchSetting = async () => {
//             try {
//                 const res = await axiosInstance.get(APIPath.GET_SETTING);

//                 const data = res?.data?.data; // ✅ FIX HERE

//                 if (data) {
//                     setValue("priceFix", data.priceFix || 0);
//                     setValue("pricePart", data.pricePart || 0);
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         };

//         fetchSetting();
//     }, [setValue]);

//     /* ======================
//        SAVE
//     ======================= */
//     const onSubmit = async (data) => {
//         try {
//             setLoading(true);

//             const res = await axiosInstance.post(
//                 APIPath.CREATE_SETTING_POINT,
//                 data
//             );

//             if (res.data) {
//                 SuccessAlert("ບັນທຶກສຳເລັດ", 1500, "success");

//                 // 🔥 sync UI again (optional but recommended)
//                 reset(data);
//             }
//         } catch (error) {
//             console.log(error);

//             SuccessAlert(
//                 error?.response?.data?.message ||
//                 "ບັນທຶກລົ້ມເຫຼວ",
//                 2000,
//                 "error"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="w-full bg-white p-6 rounded-2xl border"
//         >
//             {/* HEADER */}
//             <div className="flex justify-between items-center border-b pb-4">
//                 <h1 className="flex items-center gap-2 text-xl font-semibold">
//                     <Settings className="text-red-600" />
//                     Point Setting
//                 </h1>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-red-600 text-white px-6 py-2 rounded-xl"
//                 >
//                     <Save size={18} />
//                     {loading ? "Saving..." : "Save"}
//                 </button>
//             </div>

//             {/* BODY */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

//                 {/* priceFix */}
//                 <div className="p-4 bg-gray-50 rounded-xl">
//                     <label>Labour rule</label>

//                     <CurrencyInput
//                         value={watch("priceFix")}
//                         groupSeparator=","
//                         onValueChange={(v) =>
//                             setValue("priceFix", Number(v || 0))
//                         }
//                         className="w-full border p-3 rounded-lg mt-2"
//                     />

//                     {errors.priceFix && (
//                         <p className="text-red-500 text-sm">
//                             {errors.priceFix.message}
//                         </p>
//                     )}
//                 </div>

//                 {/* pricePart */}
//                 <div className="p-4 bg-gray-50 rounded-xl">
//                     <label>Part rule</label>

//                     <CurrencyInput
//                         value={watch("pricePart")}
//                         groupSeparator=","
//                         onValueChange={(v) =>
//                             setValue("pricePart", Number(v || 0))
//                         }
//                         className="w-full border p-3 rounded-lg mt-2"
//                     />

//                     {errors.pricePart && (
//                         <p className="text-red-500 text-sm">
//                             {errors.pricePart.message}
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </form>
//     );
// };

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

/* schema */
const pointSchema = z.object({
    priceFix: z.coerce.number().min(1),
    pricePart: z.coerce.number().min(1),
});

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
        },
    });

    /* ======================
       ດຶງຂໍ້ມູນ (GET DATA)
    ======================= */
    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const res = await axiosInstance.get(APIPath.GET_SETTING);

                const data = res?.data?.data; // ✅ ແກ້ໄຂຕົວນີ້

                if (data) {
                    setValue("priceFix", data.priceFix || 0);
                    setValue("pricePart", data.pricePart || 0);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchSetting();
    }, [setValue]);

    /* ======================
       ບັນທຶກ (SAVE)
    ======================= */
    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const res = await axiosInstance.post(
                APIPath.CREATE_SETTING_POINT,
                data
            );

            if (res.data) {
                SuccessAlert("ບັນທຶກສຳເລັດ", 1500, "success");

                // 🔥 sync UI ອີກຄັ້ງ (ບໍ່ບັງຄັບ ແຕ່ແນະນຳ)
                reset(data);
            }
        } catch (error) {
            console.log(error);

            SuccessAlert(
                error?.response?.data?.message ||
                "ບັນທຶກລົ້ມເຫຼວ",
                2000,
                "error"
            );
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
                    className="bg-red-600 text-white px-6 py-2 rounded-xl"
                >
                    <Save size={18} />
                    {loading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
                </button>
            </div>

            {/* BODY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                {/* priceFix */}
                <div className="p-4 bg-gray-50 rounded-xl">
                    <label>ກົດເກນຄ່າແຮງງານ (Labour rule)</label>

                    <CurrencyInput
                        value={watch("priceFix")}
                        groupSeparator=","
                        onValueChange={(v) =>
                            setValue("priceFix", Number(v || 0))
                        }
                        className="w-full border p-3 rounded-lg mt-2"
                    />

                    {errors.priceFix && (
                        <p className="text-red-500 text-sm">
                            {errors.priceFix.message}
                        </p>
                    )}
                </div>

                {/* pricePart */}
                <div className="p-4 bg-gray-50 rounded-xl">
                    <label>ກົດເກນຄ່າອະໄຫຼ່ (Part rule)</label>

                    <CurrencyInput
                        value={watch("pricePart")}
                        groupSeparator=","
                        onValueChange={(v) =>
                            setValue("pricePart", Number(v || 0))
                        }
                        className="w-full border p-3 rounded-lg mt-2"
                    />

                    {errors.pricePart && (
                        <p className="text-red-500 text-sm">
                            {errors.pricePart.message}
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
};

export default PointSetting;