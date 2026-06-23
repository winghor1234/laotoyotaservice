
// // import { z } from "zod";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useForm } from "react-hook-form";
// // import { useState, useEffect, useRef } from "react";
// // import APIPath from "../../../api/APIPath";
// // import axiosInstance from "../../../utils/AxiosInstance";
// // import { useTranslation } from "react-i18next";
// // import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// // import { usePoints } from "../../../utils/PointContext";
// // import { generateBillId } from "../../../utils/BillGenerate";
// // import { useNavigate } from "react-router-dom";

// // const workShopRepairSchema = (t) =>
// //   z.object({
// //     kmNext: z.coerce.number().min(1, t("min_length_1")),
// //     kmLast: z.coerce.number().min(1, t("min_length_1")),
// //     labour_total: z.coerce.number().min(1, t("min_length_1")),
// //     part_total: z.coerce.number().min(1, t("min_length_1")),
// //     labour_point: z.coerce.number().optional(),
// //     part_point: z.coerce.number().optional(),
// //     totalPoint: z.coerce.number().optional(),
// //     total_price_lak: z.coerce.number().optional(),
// //     exchange_rate: z.coerce.number().optional(),
// //     payment_currency: z.string( ).min(1, t("Please_select_currency")),
// //     payment_type: z.string().min(1, t("Please_select_payment_type")),
// //     cardId: z.string().min(1, t("Please_select_card")),
// //     tax_invoice_code: z.string().min(1, t("min_length_1")),
// //     discount: z.coerce.number().min(0).optional(),
// //     labour_discount: z.coerce.number().min(0).max(99).optional(),
// //     part_discount: z.coerce.number().min(0).max(99).optional(),
// //   });

// // export const useWorkShopRepair = () => {
// //   const { t } = useTranslation("auth");
// //   const navigate = useNavigate();
// //   const [cards, setCards] = useState([]);
// //   const [isManualLabourPoint, setIsManualLabourPoint] = useState(false);
// //   const [isManualPartPoint, setIsManualPartPoint] = useState(false);
// //   const cardDropdownRef = useRef(null);
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const [search, setSearch] = useState("");


// //   // 🔥 store computed values (IMPORTANT FIX)
// //   const [calculated, setCalculated] = useState({
// //     labour: 0,
// //     part: 0,
// //     total: 0,
// //   });
// //   const { pointSettings } = usePoints();

// //   const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
// //     resolver: zodResolver(workShopRepairSchema(t)),
// //     defaultValues: {
// //       payment_currency: "LAK",
// //       exchange_rate: "",
// //       labour_total: 0,
// //       part_total: 0,
// //       labour_point: 0,
// //       part_point: 0,
// //       totalPoint: 0,
// //       total_price_lak: 0,
// //       labour_discount: 0,
// //       part_discount: 0,
// //     },
// //   });
// //   // console.log("card", cards);

// //   // ================= WATCH =================
// //   const labour_total = Number(watch("labour_total")) || 0;
// //   const part_total = Number(watch("part_total")) || 0;
// //   const labour_point = Number(watch("labour_point")) || 0;
// //   const part_point = Number(watch("part_point")) || 0;

// //   const payment_currency = watch("payment_currency") || "LAK";
// //   const exchange_rate = Number(watch("exchange_rate")) || 1;

// //   const labour_discount = Number(watch("labour_discount")) || 0;
// //   const part_discount = Number(watch("part_discount")) || 0;

// //   // ================= FETCH =================
// //   const fetchData = async () => {
// //     try {
// //       const [cardRes] = await Promise.all([
// //         axiosInstance.get(APIPath.SELECT_ALL_CARD),
// //       ]);

// //       setCards(cardRes?.data?.data || []);
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };




// //   // ================= CALCULATION (SOURCE OF TRUTH) =================
// //   useEffect(() => {
// //     let labour = labour_total;
// //     let part = part_total;

// //     if (payment_currency === "THB" || payment_currency === "USD") {
// //       labour *= exchange_rate;
// //       part *= exchange_rate;
// //     }

// //     const labourDiscount = labour * (labour_discount / 100);
// //     const partDiscount = part * (part_discount / 100);

// //     const finalLabour = Math.max(labour - labourDiscount, 0);
// //     const finalPart = Math.max(part - partDiscount, 0);


// //     const autoLabourPoint = pointSettings.labour_amount > 0
// //       ? (finalLabour / pointSettings.labour_amount) * pointSettings.labour_point
// //       : 0;

// //     const autoPartPoint = pointSettings.part_amount > 0
// //       ? (finalPart / pointSettings.part_amount) * pointSettings.part_point
// //       : 0;


// //     const labourPointFinal = isManualLabourPoint ? labour_point : autoLabourPoint;
// //     const partPointFinal = isManualPartPoint ? part_point : autoPartPoint
// //     setValue("labour_point", parseFloat(labourPointFinal.toFixed(2)));
// //     setValue("part_point", parseFloat(partPointFinal.toFixed(2)));


// //     const totalPoint = labourPointFinal + partPointFinal;

// //     setValue("totalPoint", totalPoint);
// //     setValue("total_price_lak", finalLabour + finalPart);

// //     setCalculated({
// //       labour: finalLabour,
// //       part: finalPart,
// //       total: finalLabour + finalPart,
// //     });

// //     if (payment_currency === "LAK") {
// //       setValue("exchange_rate", "");
// //     }
// //   }, [
// //     labour_total,
// //     part_total,
// //     labour_discount,
// //     part_discount,
// //     labour_point,
// //     part_point,
// //     isManualLabourPoint,
// //     isManualPartPoint,
// //     payment_currency,
// //     exchange_rate,
// //     isManualLabourPoint,
// //     isManualPartPoint,
// //     pointSettings,
// //   ]);

// //   // ================= INIT =================
// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (cardDropdownRef.current && !cardDropdownRef.current.contains(event.target)) {
// //         setShowDropdown(false);
// //       }
// //     };

// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, []);

// //   // ================= SUBMIT (USE ONLY STATE, NO RE-CALC) =================
// //   const submitForm = async (data) => {
// //     console.log(data);
// //     try {
// //       const payload = {
// //         kmLast: data.kmLast,
// //         kmNext: data.kmNext,
// //         detailFix: data.detailFix,
// //         labour_total: calculated.labour,
// //         part_total: calculated.part,
// //         labour_point: data.labour_point,
// //         part_point: data.part_point,
// //         payment_type: data.payment_type,
// //         cardId: data.cardId,
// //         invoice_number: generateBillId(),
// //         tax_invoice_code: data.tax_invoice_code,
// //         exchange_rate:
// //           payment_currency === "LAK"
// //             ? 0
// //             : data.exchange_rate,
// //       };
// //       console.log("workshop : ",payload);

// //       const res = await axiosInstance.post(APIPath.WORKSHOP_FIX, payload);
// //       const FixId = res.data.data.fix_id;
// //       SuccessAlert(t("fix_success"));
// //       reset();
// //       navigate(`/user/workshop-fix-bill-detail/${FixId}`);
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   return {
// //     register,
// //     handleSubmit,
// //     errors,
// //     submitForm,
// //     setValue,
// //     watch,
// //     cards,
// //     setIsManualLabourPoint,
// //     setIsManualPartPoint,
// //     cardDropdownRef,
// //     showDropdown,
// //     setShowDropdown,
// //     search,
// //     setSearch
// //   };
// // };


// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useState, useEffect, useRef } from "react";
// import APIPath from "../../../api/APIPath";
// import axiosInstance from "../../../utils/AxiosInstance";
// import { useTranslation } from "react-i18next";
// import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// import { usePoints } from "../../../utils/PointContext";
// import { generateBillId } from "../../../utils/BillGenerate";
// import { useNavigate } from "react-router-dom";

// const workShopRepairSchema = (t) =>
//   z.object({
//     kmNext: z.coerce.number().min(1, t("min_length_1")),
//     kmLast: z.coerce.number().min(1, t("min_length_1")),
//     labour_total: z.coerce.number().min(1, t("min_length_1")),
//     part_total: z.coerce.number().min(1, t("min_length_1")),
//     labour_point: z.coerce.number().optional(),
//     part_point: z.coerce.number().optional(),
//     totalPoint: z.coerce.number().optional(),
//     total_price_lak: z.coerce.number().optional(),
//     exchange_rate: z.coerce.number().optional(),
//     payment_currency: z.string().min(1, t("Please_select_currency")),
//     payment_type: z.string().min(1, t("Please_select_payment_type")),
//     cardId: z.string().min(1, t("Please_select_card")),
//     tax_invoice_code: z.string().min(1, t("min_length_1")),
//     discount: z.coerce.number().min(0).optional(),
//     labour_discount: z.coerce.number().min(0).max(99).optional(),
//     part_discount: z.coerce.number().min(0).max(99).optional(),
//   });

// export const useWorkShopRepair = () => {
//   const { t } = useTranslation("auth");
//   const navigate = useNavigate();

//   const [cards, setCards] = useState([]);
//   const [isManualLabourPoint, setIsManualLabourPoint] = useState(false);
//   const [isManualPartPoint, setIsManualPartPoint] = useState(false);
//   const cardDropdownRef = useRef(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [search, setSearch] = useState("");

//   const [calculated, setCalculated] = useState({
//     labour: 0,
//     part: 0,
//     total: 0,
//   });

//   const { pointSettings } = usePoints();

//   const { register, handleSubmit, formState: { errors }, setValue, watch, reset } =
//     useForm({
//       resolver: zodResolver(workShopRepairSchema(t)),
//       defaultValues: {
//         payment_currency: "LAK",
//         exchange_rate: "",
//         labour_total: 0,
//         part_total: 0,
//         labour_point: 0,
//         part_point: 0,
//         totalPoint: 0,
//         total_price_lak: 0,
//         labour_discount: 0,
//         part_discount: 0,
//       },
//     });

//   // ================= WATCH (INT SAFE) =================
//   const labour_total = Math.round(Number(watch("labour_total")) || 0);
//   const part_total = Math.round(Number(watch("part_total")) || 0);

//   const labour_point = Math.round(Number(watch("labour_point")) || 0);
//   const part_point = Math.round(Number(watch("part_point")) || 0);

//   const payment_currency = watch("payment_currency") || "LAK";
//   const exchange_rate = Math.round(Number(watch("exchange_rate")) || 1);

//   const labour_discount = Math.round(Number(watch("labour_discount")) || 0);
//   const part_discount = Math.round(Number(watch("part_discount")) || 0);

//   // ================= FETCH =================
//   const fetchData = async () => {
//     try {
//       const [cardRes] = await Promise.all([
//         axiosInstance.get(APIPath.SELECT_ALL_CARD),
//       ]);
//       setCards(cardRes?.data?.data || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ================= CALCULATION (INT ONLY, SAME LOGIC) =================
//   useEffect(() => {
//     let labour = labour_total;
//     let part = part_total;

//     // currency conversion (INT SAFE)
//     if (payment_currency === "THB" || payment_currency === "USD") {
//       labour = Math.round(labour * exchange_rate);
//       part = Math.round(part * exchange_rate);
//     }

//     // discount (INT SAFE)
//     const labourDiscount = Math.round(labour * labour_discount / 100);
//     const partDiscount = Math.round(part * part_discount / 100);

//     const finalLabour = Math.max(labour - labourDiscount, 0);
//     const finalPart = Math.max(part - partDiscount, 0);

//     // auto point (INT SAFE)
//     const autoLabourPoint =
//       pointSettings.labour_amount > 0
//         ? Math.floor(
//           (finalLabour / pointSettings.labour_amount) *
//           pointSettings.labour_point
//         )
//         : 0;

//     const autoPartPoint =
//       pointSettings.part_amount > 0
//         ? Math.floor(
//           (finalPart / pointSettings.part_amount) *
//           pointSettings.part_point
//         )
//         : 0;

//     const labourPointFinal = isManualLabourPoint ? labour_point : autoLabourPoint;
//     const partPointFinal = isManualPartPoint ? part_point : autoPartPoint;

//     // ❌ removed toFixed + parseFloat
//     setValue("labour_point", Math.round(labourPointFinal));
//     setValue("part_point", Math.round(partPointFinal));

//     const totalPoint = labourPointFinal + partPointFinal;

//     setValue("totalPoint", Math.round(totalPoint));
//     setValue("total_price_lak", Math.round(finalLabour + finalPart));

//     setCalculated({
//       labour: finalLabour,
//       part: finalPart,
//       total: finalLabour + finalPart,
//     });

//     if (payment_currency === "LAK") {
//       setValue("exchange_rate", 0);
//     }
//   }, [
//     labour_total,
//     part_total,
//     labour_discount,
//     part_discount,
//     labour_point,
//     part_point,
//     isManualLabourPoint,
//     isManualPartPoint,
//     payment_currency,
//     exchange_rate,
//     pointSettings,
//   ]);

//   // ================= INIT =================
//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         cardDropdownRef.current &&
//         !cardDropdownRef.current.contains(event.target)
//       ) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ================= SUBMIT =================
//   const submitForm = async (data) => {
//     try {
//       const payload = {
//         kmLast: data.kmLast,
//         kmNext: data.kmNext,
//         detailFix: data.detailFix,

//         // already int
//         labour_total: calculated.labour,
//         part_total: calculated.part,

//         labour_point: data.labour_point,
//         part_point: data.part_point,

//         payment_type: data.payment_type,
//         cardId: data.cardId,
//         invoice_number: generateBillId(),
//         tax_invoice_code: data.tax_invoice_code,

//         exchange_rate:
//           payment_currency === "LAK"
//             ? 0
//             : Math.round(Number(data.exchange_rate) || 0),
//       };

//       const res = await axiosInstance.post(APIPath.WORKSHOP_FIX, payload);

//       const FixId = res.data.data.fix_id;

//       SuccessAlert(t("fix_success"));
//       reset();
//       navigate(`/user/workshop-fix-bill-detail/${FixId}`);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return {
//     register,
//     handleSubmit,
//     errors,
//     submitForm,
//     setValue,
//     watch,
//     cards,
//     setIsManualLabourPoint,
//     setIsManualPartPoint,
//     cardDropdownRef,
//     showDropdown,
//     setShowDropdown,
//     search,
//     setSearch,
//   };
// };




import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";
import { useTranslation } from "react-i18next";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { generateBillId } from "../../../utils/BillGenerate";
import { useNavigate } from "react-router-dom";

const workShopRepairSchema = (t) =>
  z.object({
    kmNext: z.coerce.number().min(1, t("min_length_1")),
    kmLast: z.coerce.number().min(1, t("min_length_1")),
    labour_total: z.coerce.number().min(1, t("min_length_1")),
    part_total: z.coerce.number().min(1, t("min_length_1")),
    labour_point: z.coerce.number().optional(),
    part_point: z.coerce.number().optional(),
    totalPoint: z.coerce.number().optional(),
    total_price_lak: z.coerce.number().optional(),
    exchange_rate: z.coerce.number().optional(),
    payment_currency: z.string().min(1, t("Please_select_currency")),
    payment_type: z.string().min(1, t("Please_select_payment_type")),
    cardId: z.string().min(1, t("Please_select_card")),
    tax_invoice_code: z.string().min(1, t("min_length_1")),
    discount: z.coerce.number().min(0).optional(),
    labour_discount: z.coerce.number().min(0).max(99).optional(),
    part_discount: z.coerce.number().min(0).max(99).optional(),
  });

export const useWorkShopRepair = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [isManualLabourPoint, setIsManualLabourPoint] = useState(false);
  const [isManualPartPoint, setIsManualPartPoint] = useState(false);
  const cardDropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ เพิ่ม state สำหรับ setting จาก API
  const [setting, setSetting] = useState({
    priceFix: 0,
    pricePart: 0,
  });

  const [calculated, setCalculated] = useState({
    labour: 0,
    part: 0,
    total: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(workShopRepairSchema(t)),
    defaultValues: {
      payment_currency: "LAK",
      exchange_rate: "",
      labour_total: 0,
      part_total: 0,
      labour_point: 0,
      part_point: 0,
      totalPoint: 0,
      total_price_lak: 0,
      labour_discount: 0,
      part_discount: 0,
    },
  });

  // ================= WATCH =================
  const labour_total = Math.round(Number(watch("labour_total")) || 0);
  const part_total = Math.round(Number(watch("part_total")) || 0);
  const labour_point = Math.round(Number(watch("labour_point")) || 0);
  const part_point = Math.round(Number(watch("part_point")) || 0);
  const payment_currency = watch("payment_currency") || "LAK";
  const exchange_rate = Math.round(Number(watch("exchange_rate")) || 1);
  const labour_discount = Math.round(Number(watch("labour_discount")) || 0);
  const part_discount = Math.round(Number(watch("part_discount")) || 0);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const [cardRes, settingRes] = await Promise.all([
        axiosInstance.get(APIPath.SELECT_ALL_CARD),
        axiosInstance.get(APIPath.GET_SETTING), // ✅ fetch setting
      ]);

      setCards(cardRes?.data?.data || []);

      // ✅ เก็บ priceFix และ pricePart จาก API
      const settingData = settingRes?.data?.data;
      if (settingData) {
        setSetting({
          priceFix: Number(settingData.priceFix) || 0,
          pricePart: Number(settingData.pricePart) || 0,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= CALCULATION =================
  useEffect(() => {
    let labour = labour_total;
    let part = part_total;

    // แปลงสกุลเงิน
    if (payment_currency === "THB" || payment_currency === "USD") {
      labour = Math.round(labour * exchange_rate);
      part = Math.round(part * exchange_rate);
    }

    // หักส่วนลด
    const labourDiscount = Math.round((labour * labour_discount) / 100);
    const partDiscount = Math.round((part * part_discount) / 100);

    const finalLabour = Math.max(labour - labourDiscount, 0);
    const finalPart = Math.max(part - partDiscount, 0);

    // ✅ คำนวณ point จาก priceFix และ pricePart
    // ตัวอย่าง: finalLabour=100000, priceFix=10000 → 100000/10000 = 10 point
    const autoLabourPoint =
      setting.priceFix > 0
        ? Math.floor(finalLabour / setting.priceFix)
        : 0;

    const autoPartPoint =
      setting.pricePart > 0
        ? Math.floor(finalPart / setting.pricePart)
        : 0;

    const labourPointFinal = isManualLabourPoint ? labour_point : autoLabourPoint;
    const partPointFinal = isManualPartPoint ? part_point : autoPartPoint;

    setValue("labour_point", Math.round(labourPointFinal));
    setValue("part_point", Math.round(partPointFinal));

    const totalPoint = labourPointFinal + partPointFinal;
    setValue("totalPoint", Math.round(totalPoint));
    setValue("total_price_lak", Math.round(finalLabour + finalPart));

    setCalculated({
      labour: finalLabour,
      part: finalPart,
      total: finalLabour + finalPart,
    });

    if (payment_currency === "LAK") {
      setValue("exchange_rate", 0);
    }
  }, [
    labour_total,
    part_total,
    labour_discount,
    part_discount,
    labour_point,
    part_point,
    isManualLabourPoint,
    isManualPartPoint,
    payment_currency,
    exchange_rate,
    setting, // ✅ เพิ่ม setting เป็น dependency
  ]);

  // ================= INIT =================
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardDropdownRef.current &&
        !cardDropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= SUBMIT =================
  const submitForm = async (data) => {
    try {
      const payload = {
        kmLast: data.kmLast,
        kmNext: data.kmNext,
        detailFix: data.detailFix,
        labour_total: calculated.labour,
        part_total: calculated.part,
        labour_point: data.labour_point,
        part_point: data.part_point,
        payment_type: data.payment_type,
        cardId: data.cardId,
        invoice_number: generateBillId(),
        tax_invoice_code: data.tax_invoice_code,
        exchange_rate:
          payment_currency === "LAK"
            ? 0
            : Math.round(Number(data.exchange_rate) || 0),
      };

      const res = await axiosInstance.post(APIPath.WORKSHOP_FIX, payload);
      const FixId = res.data.data.fix_id;
      SuccessAlert(t("fix_success"));
      navigate(`/user/workshop-fix-bill-detail/${FixId}`);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    submitForm,
    setValue,
    watch,
    cards,
    setIsManualLabourPoint,
    setIsManualPartPoint,
    cardDropdownRef,
    showDropdown,
    setShowDropdown,
    search,
    setSearch,
    setting, // ✅ export ออกไปด้วยเผื่อ UI ต้องใช้
  };
};





// import { useTranslation } from "react-i18next";
// import CurrencyInput from "react-currency-input-field";
// import { useWorkShopRepair } from "../../component/schemaValidate/workShopRepairValidate/WorkShopRepairValidate";
// import { useState } from "react";
// import { X } from "lucide-react";

// const WorkShopFix = ({ show, onClose }) => {
//     const { t } = useTranslation("booking");
//     const {
//         register,
//         handleSubmit,
//         errors,
//         submitForm,
//         setValue,
//         watch,
//         cards,
//         search,
//         setSearch,
//         showDropdown,
//         setShowDropdown,
//         cardDropdownRef,
//         calculated,
//     } = useWorkShopRepair();

//     const [selectedCard, setSelectedCard] = useState(null);

//     const payment_currency = watch("payment_currency");
//     const currencyText =
//         payment_currency === "THB"
//             ? "฿"
//             : payment_currency === "USD"
//                 ? "$"
//                 : t("kip_text");

//     const totalPrice = calculated?.total || 0;

//     if (!show) return null;

//     return (
//         <>
//             {/* ✅ Backdrop: clicking this triggers onClose */}
//             <div
//                 className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
//                 onClick={onClose}
//             />

//             {/* ✅ Modal container: centered, above backdrop, clicks stop here */}
//             <div
//                 className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[800px] px-4"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <form
//                     onSubmit={handleSubmit(submitForm)}
//                     className="bg-white flex flex-col gap-6 p-4 sm:p-6 rounded-2xl max-h-[90vh] overflow-y-auto"
//                 >
//                     <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
//                         {t("fix_title")}
//                     </h2>

//                     <div className="space-y-4 sm:space-y-6">
//                         {/* card number */}
//                         <div ref={cardDropdownRef} className="flex flex-col relative">
//                             <input type="hidden" {...register("cardId")} />
//                             <input
//                                 type="text"
//                                 value={search}
//                                 placeholder={t("select_card")}
//                                 onChange={(e) => {
//                                     setSearch(e.target.value);
//                                     setSelectedCard(null);
//                                     setShowDropdown(true);
//                                 }}
//                                 onFocus={() => {
//                                     if (!selectedCard) setShowDropdown(true);
//                                 }}
//                                 className="w-full py-2 sm:py-3.5 rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-red-500 focus:border-red-500"
//                             />
//                             {search && (
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setSearch("");
//                                         setValue("cardId", "");
//                                         setSelectedCard(null);
//                                         setShowDropdown(true);
//                                     }}
//                                     className="absolute right-3 top-2/6 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
//                                 >
//                                     <X />
//                                 </button>
//                             )}
//                             {showDropdown && !selectedCard && (
//                                 <div className="absolute z-10 top-[65px] w-full bg-white border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto shadow">
//                                     {cards
//                                         .filter((card) =>
//                                             `${card.card_number} ${card.card_type}`
//                                                 .toLowerCase()
//                                                 .includes(search.toLowerCase())
//                                         )
//                                         .map((card) => (
//                                             <div
//                                                 key={card.card_id}
//                                                 onClick={() => {
//                                                     setSearch(`${card.card_number} ${card.card_type}`);
//                                                     setSelectedCard(card);
//                                                     setValue("cardId", card.card_id);
//                                                     setShowDropdown(false);
//                                                 }}
//                                                 className="px-3 py-2 text-sm cursor-pointer hover:bg-red-600 hover:text-white"
//                                             >
//                                                 {card.card_number} {card.card_type} : {card.total_point || 0}
//                                             </div>
//                                         ))}
//                                 </div>
//                             )}
//                             <div className="h-6">
//                                 {errors.cardId && <p className="text-red-500 text-sm">{errors.cardId.message}</p>}
//                             </div>
//                         </div>

//                         {/* tax invoice code */}
//                         <div className="flex flex-col">
//                             <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("tax_invoice_code_text")}</label>
//                             <input
//                                 {...register("tax_invoice_code")}
//                                 placeholder={t("tax_invoice_code_placeholder")}
//                                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-base outline-none hover:border-red-500 focus:border-red-500 shadow-sm transition-colors"
//                             />
//                             <div className="h-6">{errors.tax_invoice_code && <p className="text-red-500 text-sm">{errors.tax_invoice_code.message}</p>}</div>
//                         </div>

//                         {/* payment type */}
//                         <div className="flex flex-col">
//                             <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("payment_type_text")}</label>
//                             <select
//                                 {...register("payment_type")}
//                                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-500 shadow-sm transition-colors"
//                             >
//                                 <option disabled value="">{t("select_payment_type")}</option>
//                                 <option value="Cash">{t("cash")}</option>
//                                 <option value="Transfer">{t("transfer")}</option>
//                             </select>
//                             <div className="h-6">{errors.payment_type && <p className="text-red-500 text-sm">{errors.payment_type.message}</p>}</div>
//                         </div>

//                         {/* car info */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                             <div className="flex flex-col relative">
//                                 <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("kmLast_text")}</label>
//                                 <input
//                                     {...register("kmLast")}
//                                     placeholder={t("kmLast")}
//                                     className="w-full py-2 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-red-500 focus:border-red-500 shadow-sm transition-colors pr-12"
//                                 />
//                                 <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 pointer-events-none">
//                                     {t("km_text")}
//                                 </span>
//                                 <div className="h-6">{errors.kmLast && <p className="text-red-500 text-sm">{errors.kmLast.message}</p>}</div>
//                             </div>
//                             <div className="flex flex-col relative">
//                                 <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("kmNext_text")}</label>
//                                 <input
//                                     {...register("kmNext")}
//                                     placeholder={t("kmNext")}
//                                     className="w-full py-2 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-red-500 focus:border-red-500 shadow-sm transition-colors pr-12"
//                                 />
//                                 <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 pointer-events-none">
//                                     {t("km_text")}
//                                 </span>
//                                 <div className="h-6">{errors.kmNext && <p className="text-red-500 text-sm">{errors.kmNext.message}</p>}</div>
//                             </div>
//                         </div>

//                         {/* Detail Fix */}
//                         <div className="flex flex-col">
//                             <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("Optional_text")}</label>
//                             <textarea
//                                 {...register("detailFix")}
//                                 placeholder={t("detailFix")}
//                                 rows={3}
//                                 className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-red-500 focus:border-red-500 shadow-sm transition-colors resize-none"
//                             />
//                         </div>

//                         {/* Payment Currency + Exchange Rate */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                             <div className="flex flex-col">
//                                 <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("payment_currency_text")}</label>
//                                 <select
//                                     {...register("payment_currency")}
//                                     className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none"
//                                 >
//                                     <option value="LAK">{t("LAK")}</option>
//                                     <option value="THB">{t("THB")}</option>
//                                     <option value="USD">{t("USD")}</option>
//                                 </select>
//                             </div>
//                             <div className="flex flex-col relative">
//                                 <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("exchange_rate_text")}</label>
//                                 <CurrencyInput
//                                     value={payment_currency === "LAK" ? "" : watch("exchange_rate")}
//                                     disabled={payment_currency === "LAK"}
//                                     placeholder={payment_currency === "LAK" ? t("no_exchange_Rate") : t("exchange_Rate")}
//                                     groupSeparator=","
//                                     decimalsLimit={2}
//                                     className={`w-full py-3 sm:py-4 px-4 sm:px-6 border rounded-lg text-base sm:text-lg outline-none ${payment_currency === "LAK"
//                                         ? "bg-gray-200 cursor-not-allowed text-gray-500"
//                                         : "border-gray-300"
//                                         }`}
//                                     onValueChange={(value) =>
//                                         setValue("exchange_rate", value ? Number(value) : "")
//                                     }
//                                 />
//                             </div>
//                         </div>

//                         {/* Labour */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                             <div className="flex flex-col relative">
//                                 <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("labour_text")}</label>
//                                 <CurrencyInput
//                                     placeholder={t("labour_total_placholder")}
//                                     groupSeparator=","
//                                     decimalsLimit={0}
//                                     className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-red-500 focus:border-red-500 shadow-sm transition-colors pr-12"
//                                     onValueChange={(value) => setValue("labour_total", Number(value) || 0)}
//                                 />
//                                 <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
//                                     {currencyText}
//                                 </span>
//                                 <div className="h-6">{errors.labour_total && <p className="text-red-500 text-sm">{errors.labour_total.message}</p>}</div>
//                             </div>

//                             <div className="flex items-center justify-center gap-4">
//                                 <div className="flex flex-col relative">
//                                     <label className="mb-1 text-gray-500 text-sm sm:text-base">{t("labour_point_text")}</label>
//                                     <CurrencyInput
//                                         readOnly
//                                         value={Number(watch("labour_point") || 0)}
//                                         groupSeparator=","
//                                         decimalsLimit={0}
//                                         className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-lg text-base sm:text-lg outline-none shadow-sm pr-12"
//                                     />
//                                     <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
//                                         {t("point_text")}
//                                     </span>
//                                     <div className="h-6">{errors.labour_point && <p className="text-red-500 text-sm">{errors.labour_point.message}</p>}</div>
//                                 </div>
//                                 <div className="flex flex-col relative">
//                                     <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("labour_discount_text")}</label>
//                                     <CurrencyInput
//                                         value={watch("labour_discount")}
//                                         placeholder={t("labour_discount_placholder")}
//                                         groupSeparator=","
//                                         decimalsLimit={0}
//                                         className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-red-500 focus:border-red-500 shadow-sm transition-colors pr-12"
//                                         onKeyDown={(e) => {
//                                             const input = e.currentTarget;
//                                             if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;
//                                             const selected = input.value.substring(input.selectionStart, input.selectionEnd);
//                                             if (selected.length > 0) return;
//                                             const rawValue = input.value.replace(/,/g, "");
//                                             if (rawValue.length >= 2) e.preventDefault();
//                                         }}
//                                         onValueChange={(value) => setValue("labour_discount", value ? Number(value) : 0)}
//                                     />
//                                     <span className="absolute right-2 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">%</span>
//                                     <div className="h-6">{errors.labour_discount && <p className="text-red-500 text-sm">{errors.labour_discount.message}</p>}</div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Part */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                             <div className="flex flex-col relative">
//                                 <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("part_total_text")}</label>
//                                 <CurrencyInput
//                                     placeholder={t("part_total_placholder")}
//                                     groupSeparator=","
//                                     decimalsLimit={0}
//                                     className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-red-500 focus:border-red-500 shadow-sm transition-colors pr-12"
//                                     onValueChange={(value) => setValue("part_total", Number(value) || 0)}
//                                 />
//                                 <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
//                                     {currencyText}
//                                 </span>
//                                 <div className="h-6">{errors.part_total && <p className="text-red-500 text-sm">{errors.part_total.message}</p>}</div>
//                             </div>

//                             <div className="flex items-center justify-center gap-4">
//                                 <div className="flex flex-col relative">
//                                     <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("part_point_text")}</label>
//                                     <CurrencyInput
//                                         readOnly
//                                         value={Number(watch("part_point") || 0)}
//                                         groupSeparator=","
//                                         decimalsLimit={0}
//                                         className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-lg text-base sm:text-lg outline-none shadow-sm pr-12"
//                                     />
//                                     <span className="absolute right-4 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">
//                                         {t("point_text")}
//                                     </span>
//                                     <div className="h-6">{errors.part_point && <p className="text-red-500 text-sm">{errors.part_point.message}</p>}</div>
//                                 </div>
//                                 <div className="flex flex-col relative">
//                                     <label className="mb-1 text-gray-600 text-sm sm:text-base">{t("part_discount_text")}</label>
//                                     <CurrencyInput
//                                         value={watch("part_discount")}
//                                         placeholder={t("part_discount_placholder")}
//                                         decimalsLimit={0}
//                                         className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 rounded-lg text-base sm:text-lg outline-none hover:border-red-500 focus:border-red-500 shadow-sm transition-colors pr-12"
//                                         onKeyDown={(e) => {
//                                             const input = e.currentTarget;
//                                             if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;
//                                             const selected = input.value.substring(input.selectionStart, input.selectionEnd);
//                                             if (selected.length > 0) return;
//                                             const rawValue = input.value.replace(/,/g, "");
//                                             if (rawValue.length >= 2) e.preventDefault();
//                                         }}
//                                         onValueChange={(value) => setValue("part_discount", value ? Number(value) : 0)}
//                                     />
//                                     <span className="absolute right-2 inset-y-0 translate-y-1 flex items-center text-gray-500 text-base sm:text-lg">%</span>
//                                     <div className="h-6">{errors.part_discount && <p className="text-red-500 text-sm">{errors.part_discount.message}</p>}</div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* totalPrice */}
//                         <div className="flex flex-col relative">
//                             <h2 className="text-xl text-gray-600">{t("totalPrice")}</h2>
//                             <CurrencyInput
//                                 readOnly
//                                 value={totalPrice}
//                                 groupSeparator=","
//                                 decimalsLimit={0}
//                                 className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-lg text-base sm:text-lg outline-none shadow-sm pr-12"
//                             />
//                             <span className="absolute right-4 inset-y-0 translate-y-3 flex items-center text-gray-500 text-base sm:text-lg">
//                                 {t("kip_text")}
//                             </span>
//                         </div>

//                         {/* total Point */}
//                         <div className="flex flex-col relative">
//                             <h2 className="text-xl text-gray-600">{t("totalPoint")}</h2>
//                             <CurrencyInput
//                                 readOnly
//                                 value={watch("totalPoint")}
//                                 groupSeparator=","
//                                 decimalsLimit={0}
//                                 className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-lg text-base sm:text-lg outline-none shadow-sm pr-12"
//                             />
//                             <span className="absolute right-4 inset-y-0 translate-y-3 flex items-center text-gray-500 text-base sm:text-lg">
//                                 {t("point_text")}
//                             </span>
//                         </div>

//                         {/* Total LAK */}
//                         <div className="flex flex-col relative">
//                             <h2 className="text-xl text-gray-600">{t("total_price_lak")}</h2>
//                             <CurrencyInput
//                                 readOnly
//                                 value={watch("total_price_lak")}
//                                 groupSeparator=","
//                                 decimalsLimit={0}
//                                 className="w-full py-3 sm:py-4 px-4 sm:px-6 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-lg text-base sm:text-lg outline-none"
//                             />
//                             <span className="absolute right-4 inset-y-0 flex items-center text-gray-500 text-base sm:text-lg">
//                                 {t("kip_text")}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg w-full sm:w-32 h-12 cursor-pointer transition-colors text-sm sm:text-base"
//                         >
//                             {t("cancel")}
//                         </button>
//                         <button
//                             type="submit"
//                             className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg w-full sm:w-32 h-12 cursor-pointer transition-colors text-sm sm:text-base"
//                         >
//                             {t("submit")}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </>
//     );
// };

// export default WorkShopFix;