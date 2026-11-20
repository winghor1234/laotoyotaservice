


// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useState, useEffect, useRef } from "react";
// import APIPath from "../../../api/APIPath";
// import axiosInstance from "../../../utils/AxiosInstance";
// import { useTranslation } from "react-i18next";
// import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// import { generateBillId } from "../../../utils/BillGenerate";
// import { useNavigate } from "react-router-dom";

// const workShopRepairSchema = (t) =>
//   z.object({
//     kmNext: z.coerce.number().min(1, t("min_length_1")),
//     kmLast: z.coerce.number().min(1, t("min_length_1")),
//     // labour_total: z.coerce.number().min(1, t("min_length_1")),
//     // part_total: z.coerce.number().min(1, t("min_length_1")),
//     // labour_point: z.coerce.number().optional(),
//     // part_point: z.coerce.number().optional(),
//     // total_point: z.coerce.number().optional(),
//     total_price: z.coerce.number().optional(),
//     total_point: z.coerce.number().optional(),
//     total_price_lak: z.coerce.number().optional(),
//     exchange_rate: z.coerce.number().optional(),
//     payment_currency: z.string().min(1, t("Please_select_currency")),
//     payment_type: z.string().min(1, t("Please_select_payment_type")),
//     cardId: z.string().min(1, t("Please_select_card")),
//     tax_invoice_code: z.string().min(1, t("min_length_1")),
//     discount: z.coerce.number().min(0).optional(),
//     // labour_discount: z.coerce.number().min(0).max(99).optional(),
//     // part_discount: z.coerce.number().min(0).max(99).optional(),
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

//   // ✅ เพิ่ม state สำหรับ setting จาก API
//   const [setting, setSetting] = useState({
//     priceFix: 0,
//     pricePart: 0,
//   });

//   const [calculated, setCalculated] = useState({
//     total: 0,
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//     reset,
//   } = useForm({
//     resolver: zodResolver(workShopRepairSchema(t)),
//     defaultValues: {
//       payment_currency: "LAK",
//       exchange_rate: "",
//       // labour_total: 0,
//       // part_total: 0,
//       // labour_point: 0,
//       // part_point: 0,
//       // total_point: 0,
//       total_price: 0,
//       discount: 0,
//       totalPoint: 0,
//       total_price_lak: 0,
//       // labour_discount: 0,
//       // part_discount: 0,
//     },
//   });

//   // ================= WATCH =================
//   // const labour_total = Math.round(Number(watch("labour_total")) || 0);
//   // const part_total = Math.round(Number(watch("part_total")) || 0);
//   // const labour_point = Math.round(Number(watch("labour_point")) || 0);
//   // const part_point = Math.round(Number(watch("part_point")) || 0);
//   const total_point = Math.round(Number(watch("total_point")) || 0);
//   const total_price = Math.round(Number(watch("total_price")) || 0);
//   const payment_currency = watch("payment_currency") || "LAK";
//   const exchange_rate = Math.round(Number(watch("exchange_rate")) || 1);
//   const discount = Math.round(Number(watch("discount")) || 0);
//   // const labour_discount = Math.round(Number(watch("labour_discount")) || 0);
//   // const part_discount = Math.round(Number(watch("part_discount")) || 0);

//   // ================= FETCH =================
//   const fetchData = async () => {
//     try {
//       const [cardRes, settingRes] = await Promise.all([
//         axiosInstance.get(APIPath.SELECT_ALL_CARD),
//         axiosInstance.get(APIPath.GET_SETTING), // ✅ fetch setting
//       ]);

//       setCards(cardRes?.data?.data || []);

//       // ✅ เก็บ priceFix และ pricePart จาก API
//       const settingData = settingRes?.data?.data;
//       if (settingData) {
//         setSetting({
//           priceFix: Number(settingData.priceFix) || 0,
//           pricePart: Number(settingData.pricePart) || 0,
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ================= CALCULATION =================
//   useEffect(() => {
//     // let labour = labour_total;
//     // let part = part_total;
//     let total = total_price;

//     // แปลงสกุลเงิน
//     if (payment_currency === "THB" || payment_currency === "USD") {
//       total = Math.round(total * exchange_rate);
//       // labour = Math.round(labour * exchange_rate);
//       // part = Math.round(part * exchange_rate);
//     }

//     // หักส่วนลด
//     // const labourDiscount = Math.round((labour * labour_discount) / 100);
//     // const partDiscount = Math.round((part * part_discount) / 100);
//     const dataDiscount = Math.round((total * discount) / 100);

//     // const finalLabour = Math.max(labour - labourDiscount, 0);
//     // const finalPart = Math.max(part - partDiscount, 0);
//     const finalPrice = Math.max(total - dataDiscount, 0);

//     // ✅ คำนวณ point จาก priceFix และ pricePart
//     // ตัวอย่าง: finalLabour=100000, priceFix=10000 → 100000/10000 = 10 point
//     const autofinalPoint =
//       setting.priceFix > 0
//         ? Math.floor(finalPrice / setting.priceFix)
//         : 0;

//     // const autoPartPoint =
//     //   setting.pricePart > 0
//     //     ? Math.floor(finalPart / setting.pricePart)
//     //     : 0;

//     const PointFinal = isManualLabourPoint ? total_point : autofinalPoint;
//     // const partPointFinal = isManualPartPoint ? part_point : autoPartPoint;

//     // setValue("point", Math.round(PointFinal));
//     // setValue("part_point", Math.round(partPointFinal));

//     // const totalPoint = labourPointFinal + partPointFinal;
//     setValue("total_point", Math.round(PointFinal));
//     setValue("total_price_lak", Math.round(PointFinal));

//     setCalculated({
//       // labour: finalLabour,
//       // part: finalPart,
//       // total: finalLabour + finalPart,
//       total: finalPrice,
//     });

//     if (payment_currency === "LAK") {
//       setValue("exchange_rate", 0);
//     }
//   }, [
//     // labour_total,
//     // part_total,
//     // labour_discount,
//     // part_discount,
//     // labour_point,
//     // part_point,
//     discount,
//     isManualLabourPoint,
//     isManualPartPoint,
//     payment_currency,
//     exchange_rate,
//     setting, 
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
//         // labour_total: calculated.labour,
//         // part_total: calculated.part,
//         // labour_point: data.labour_point,
//         // part_point: data.part_point,
//         totalPrice: calculated.total,
//         payment_type: data.payment_type,
//         cardId: data.cardId,
//         invoice_number: generateBillId(),
//         tax_invoice_code: data.tax_invoice_code,
//         exchange_rate:
//           payment_currency === "LAK"
//             ? 0
//             : Math.round(Number(data.exchange_rate) || 0),
//       };
//       // console.log("payload : ",payload);

//       const res = await axiosInstance.post(APIPath.WORKSHOP_FIX, payload);
//       const FixId = res.data.data.fix_id;
//       SuccessAlert(t("fix_success"));
//       navigate(`/user/workshop-fix-bill-detail/${FixId}`);
//       reset();
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
//     setting,
//     calculated,
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
    detailFix: z.string().optional(),
    // labour_total: z.coerce.number().min(1, t("min_length_1")),
    // part_total: z.coerce.number().min(1, t("min_length_1")),
    // labour_point: z.coerce.number().optional(),
    // part_point: z.coerce.number().optional(),
    // total_point: z.coerce.number().optional(),
    total_price: z.coerce.number().optional(),
    total_point: z.coerce.number().optional(),
    total_price_lak: z.coerce.number().optional(),
    exchange_rate: z.coerce.number().optional(),
    payment_currency: z.string().min(1, t("Please_select_currency")),
    payment_type: z.string().min(1, t("Please_select_payment_type")),
    cardId: z.string().min(1, t("Please_select_card")),
    tax_invoice_code: z.string().min(1, t("min_length_1")),
    discount: z.coerce.number().min(0).optional(),
    // labour_discount: z.coerce.number().min(0).max(99).optional(),
    // part_discount: z.coerce.number().min(0).max(99).optional(),
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

  const [setting, setSetting] = useState({
    priceFix: 0,
    pricePart: 0,
  });

  const [calculated, setCalculated] = useState({
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
      // labour_total: 0,
      // part_total: 0,
      // labour_point: 0,
      // part_point: 0,
      // total_point: 0,
      total_price: 0,
      discount: 0,
      total_point: 0,
      total_price_lak: 0,
      // labour_discount: 0,
      // part_discount: 0,
    },
  });

  // ================= WATCH =================
  // const labour_total = Math.round(Number(watch("labour_total")) || 0);
  // const part_total = Math.round(Number(watch("part_total")) || 0);
  // const labour_point = Math.round(Number(watch("labour_point")) || 0);
  // const part_point = Math.round(Number(watch("part_point")) || 0);

  const total_point = Math.round(Number(watch("total_point")) || 0);
  const total_price = Math.round(Number(watch("total_price")) || 0);
  const payment_currency = watch("payment_currency") || "LAK";
  const exchange_rate = Math.round(Number(watch("exchange_rate")) || 1);
  const discount = Math.round(Number(watch("discount")) || 0);

  // const labour_discount = Math.round(Number(watch("labour_discount")) || 0);
  // const part_discount = Math.round(Number(watch("part_discount")) || 0);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const [cardRes, settingRes] = await Promise.all([
        axiosInstance.get(APIPath.SELECT_ALL_CARD),
        axiosInstance.get(APIPath.GET_SETTING),
      ]);

      setCards(cardRes?.data?.data || []);

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
    // let labour = labour_total;
    // let part = part_total;

    let total = total_price;

    // แปลงสกุลเงินเป็น LAK
    if (payment_currency === "THB" || payment_currency === "USD") {
      total = Math.round(total * exchange_rate);
    }

    // หักส่วนลด
    // const labourDiscount = Math.round((labour * labour_discount) / 100);
    // const partDiscount = Math.round((part * part_discount) / 100);

    const dataDiscount = Math.round((total * discount) / 100);

    // const finalLabour = Math.max(labour - labourDiscount, 0);
    // const finalPart = Math.max(part - partDiscount, 0);

    const finalPrice = Math.max(total - dataDiscount, 0);

    // คำนวณ Point จาก priceFix
    const autofinalPoint =
      setting.priceFix > 0
        ? Math.floor(finalPrice / setting.priceFix)
        : 0;

    // const autoPartPoint =
    //   setting.pricePart > 0
    //     ? Math.floor(finalPart / setting.pricePart)
    //     : 0;

    const PointFinal = isManualLabourPoint
      ? total_point
      : autofinalPoint;

    // const partPointFinal = isManualPartPoint ? part_point : autoPartPoint;

    // setValue("point", Math.round(PointFinal));
    // setValue("part_point", Math.round(partPointFinal));

    // const totalPoint = labourPointFinal + partPointFinal;

    setValue("total_point", Math.round(PointFinal));
    setValue("total_price_lak", Math.round(finalPrice));

    setCalculated({
      // labour: finalLabour,
      // part: finalPart,
      // total: finalLabour + finalPart,
      price: finalPrice,
      point: PointFinal
    });

    if (payment_currency === "LAK") {
      setValue("exchange_rate", 0);
    }
  }, [
    // labour_total,
    // part_total,
    // labour_discount,
    // part_discount,
    // labour_point,
    // part_point,
    total_price,
    total_point,
    discount,
    isManualLabourPoint,
    isManualPartPoint,
    payment_currency,
    exchange_rate,
    setting,
    setValue,
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

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= SUBMIT =================
  const submitForm = async (data) => {
    try {
      const payload = {
        kmLast: data.kmLast,
        kmNext: data.kmNext,
        detailFix: data.detailFix,
        // labour_total: calculated.labour,
        // part_total: calculated.part,
        // labour_point: data.labour_point,
        // part_point: data.part_point,
        price: calculated.price,
        point: calculated.point,
        payment_type: data.payment_type,
        cardId: data.cardId,
        invoice_number: generateBillId(),
        tax_invoice_code: data.tax_invoice_code,
        exchange_rate:
          payment_currency === "LAK"
            ? 0
            : Math.round(Number(data.exchange_rate) || 0),
      };

      // console.log("payload : ",payload);

      const res = await axiosInstance.post(APIPath.WORKSHOP_FIX, payload);
      const message = res.data.message == "invoice already exist" ? t("invoice_exist") : t("fix_success");
      if (message == t("invoice_exist")) { SuccessAlert(message, 1500, "warning") }
      else {
        SuccessAlert(message)
        reset();
        const FixId = res.data.data.fix_id;
        SuccessAlert(t("fix_success"));
        navigate(`/user/workshop-fix-bill-detail/${FixId}`);
        reset();
      }
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
    setting,
    calculated,
  };
};


