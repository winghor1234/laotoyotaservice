// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// import APIPath from "../../../api/APIPath";
// import axiosInstance from "../../../utils/AxiosInstance";

// const storeSchema = z.object({
//   name: z.string().min(1, "ກະລຸນາໃສ່ຊື່ຮ້ານ").max(200),
//   address: z.string().min(1, "ກະລຸນາໃສ່ທີ່ຢູ່").max(500),
//   phone: z.string().min(8, "ເບີໂທຕ້ອງຢ່າງໜ້ອຍ 8 ຕົວເລກ").max(15),
//   // discount: z.coerce.number().min(0).default(0),
//   status: z.boolean().optional(),
// });

// export const useEditStoreForm = ({ onClose, store_id, handleFetchStore }) => {
//   const [loading, setLoading] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [existingImage, setExistingImage] = useState(null);

//   const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
//     resolver: zodResolver(storeSchema),
//     defaultValues: {
//       name: "",
//       address: "",
//       phone: "",
//       // discount: 0,
//       status: true,
//     }
//   });

//   useEffect(() => {
//     const fetchDataById = async () => {
//       if (!store_id) return;
//       setLoading(true);
//       try {
//         const res = await axiosInstance.get(APIPath.SELECT_ONE_STORE(store_id));
//         const data = res?.data?.data;
//         if (data) {
//           // parse discount ຈາກ qrCode JSON
//           // let discount = 0;
//           // try { discount = JSON.parse(data.qrCode)?.discount ?? 0; } catch (_) {}
//           reset({
//             name: data.name || "",
//             address: data.address || "",
//             phone: data.phone || "",
//             // discount,
//             status: data.status ?? true,
//           });
//           setExistingImage(data.image || null);
//         }
//       } catch (error) {
//         console.error("Error fetching Store:", error);
//         SuccessAlert("ດຶງຂໍ້ມູນຮ້ານຄ້າລົ້ມເຫລວ", 2000, "error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDataById();
//   }, [store_id, reset]);

//   const submitForm = async (data) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("name", data.name.trim());
//       formData.append("address", data.address.trim());
//       formData.append("phone", data.phone.trim());
//       formData.append("discount", data.discount ?? 0);
//       formData.append("status", data.status ? "true" : "false");
//       if (imageFile) formData.append("files", imageFile);

//       const response = await axiosInstance.put(APIPath.UPDATE_STORE(store_id), formData);
//       if (response.data) {
//         await handleFetchStore();
//         SuccessAlert("ແກ້ໄຂຮ້ານຄ້າສຳເລັດ", 1500, "success");
//         onClose();
//       }
//     } catch (error) {
//       console.error("Update Store failed:", error);
//       SuccessAlert(error.response?.data?.message || "ແກ້ໄຂຮ້ານຄ້າລົ້ມເຫລວ", 2000, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { register, handleSubmit, submitForm, errors, loading, imageFile, setImageFile, existingImage, setValue };
// };



import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import APIPath from "../../../api/APIPath";
import axiosInstance from "../../../utils/AxiosInstance";

/* =========================================================
   Store Schema
========================================================= */

const storeSchema = z.object({
  name: z.string().min(1, "ກະລຸນາໃສ່ຊື່ຮ້ານ").max(200),

  address: z.string().min(1, "ກະລຸນາໃສ່ທີ່ຢູ່").max(500),

  phone: z.string().min(8, "ເບີໂທຕ້ອງຢ່າງໜ້ອຍ 8 ຕົວເລກ").max(15),

  // discount: z.coerce.number().min(0).default(0),

  /* -----------------------------------------------------
     Latitude (optional) : -90 to 90
  ----------------------------------------------------- */

  latitude: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        (Number.isFinite(Number(value)) &&
          Number(value) >= -90 &&
          Number(value) <= 90),
      { message: "Latitude ຕ້ອງຢູ່ລະຫວ່າງ -90 ຫາ 90" }
    ),

  /* -----------------------------------------------------
     Longitude (optional) : -180 to 180
  ----------------------------------------------------- */

  longitude: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value === "" ||
        (Number.isFinite(Number(value)) &&
          Number(value) >= -180 &&
          Number(value) <= 180),
      { message: "Longitude ຕ້ອງຢູ່ລະຫວ່າງ -180 ຫາ 180" }
    ),

  status: z.boolean().optional(),
});

/* =========================================================
   useEditStoreForm
========================================================= */

export const useEditStoreForm = ({ onClose, store_id, handleFetchStore }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      // discount: 0,
      latitude: "",
      longitude: "",
      status: true,
    },
  });

  /* =======================================================
     Load Store By ID
  ======================================================= */

  useEffect(() => {
    const fetchDataById = async () => {
      if (!store_id) return;

      setLoading(true);

      try {
        const res = await axiosInstance.get(APIPath.SELECT_ONE_STORE(store_id));
        const data = res?.data?.data;

        if (data) {
          // parse discount ຈາກ qrCode JSON
          // let discount = 0;
          // try { discount = JSON.parse(data.qrCode)?.discount ?? 0; } catch (_) {}

          reset({
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            // discount,
            // API may return numbers/null — the form works with strings
            latitude:
              data.latitude !== null && data.latitude !== undefined
                ? String(data.latitude)
                : "",
            longitude:
              data.longitude !== null && data.longitude !== undefined
                ? String(data.longitude)
                : "",
            status: data.status ?? true,
          });

          setExistingImage(data.image || null);
        }
      } catch (error) {
        console.error("Error fetching Store:", error);
        SuccessAlert("ດຶງຂໍ້ມູນຮ້ານຄ້າລົ້ມເຫລວ", 2000, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDataById();
  }, [store_id, reset]);

  /* =======================================================
     Submit
  ======================================================= */

  const submitForm = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", data.name.trim());
      formData.append("address", data.address.trim());
      formData.append("phone", data.phone.trim());
      formData.append("discount", data.discount ?? 0);

      // Location (optional)
      if (data.latitude !== undefined && data.latitude !== "") {
        formData.append("latitude", String(data.latitude).trim());
      }

      if (data.longitude !== undefined && data.longitude !== "") {
        formData.append("longitude", String(data.longitude).trim());
      }

      formData.append("status", data.status ? "true" : "false");

      if (imageFile) formData.append("files", imageFile);

      const response = await axiosInstance.put(
        APIPath.UPDATE_STORE(store_id),
        formData
      );

      if (response.data) {
        await handleFetchStore();
        SuccessAlert("ແກ້ໄຂຮ້ານຄ້າສຳເລັດ", 1500, "success");
        onClose();
      }
    } catch (error) {
      console.error("Update Store failed:", error);

      SuccessAlert(
        error.response?.data?.message || "ແກ້ໄຂຮ້ານຄ້າລົ້ມເຫລວ",
        2000,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    submitForm,
    errors,
    loading,
    imageFile,
    setImageFile,
    existingImage,
    setValue,
    getValues,
    watch,
  };
};