// import { z } from "zod";
// import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axiosInstance from "../../../utils/AxiosInstance";
// import APIPath from "../../../api/APIPath";
// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// // Enhanced Zod schema with better validation
// export const BranchSchema = (t) => z.object({
//   branch_name: z
//     .string()
//     .min(1, { message: t("title_required") })
//     .min(2, { message: t("min_length_2") })
//     .max(100, { message: t("max_length_100") }),
//   location: z
//     .string()
//     .min(1, { message: t("location_required") })
//     .min(5, { message: t("min_length_5") })
//     .max(500, { message: t("max_length_500") }),
//   phone: z
//     .string()
//     .min(8, { message: t("phone_min_length_8") })
//     .max(15, { message: t("phone_max_length_15") })
//     .optional()

// });

// export const useEditBranchForm = ({ onClose, branch_id, handleFetchBranch }) => {
//   const { t } = useTranslation("branch");
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     // setValue,
//     reset,
//     // watch,
//     formState: { errors, isDirty }
//   } = useForm({
//     resolver: zodResolver(BranchSchema(t)),
//     defaultValues: {
//       branch_name: "",
//       location: "",
//       phone: "",
//     }
//   });

//   // const imageFile = watch("image");

//   useEffect(() => {
//     const fetchDataById = async () => {
//       if (!branch_id) return;

//       setLoading(true);
//       try {
//         const res = await axiosInstance.get(APIPath.SELECT_ONE_BRANCH(branch_id));
//         const data = res?.data?.data;

//         if (data) {
//           reset({
//             branch_name: data.branch_name || "",
//             location: data.location || "",
//             phone: data.phone || "",
//             // image: data.image || null
//           });
//           // setExistingImage(data.image || null);
//         }
//       } catch (error) {
//         console.error("Error fetching Branch:", error);
//         SuccessAlert(t("fetch_error"), 2000, "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDataById();
//   }, [branch_id, reset, t]);

//   const submitForm = async (data) => {
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("branch_name", data.branch_name.trim());
//       formData.append("location", data.location.trim());
//       formData.append("phone", data.phone.trim());



//       const response = await axiosInstance.put(
//         APIPath.UPDATE_BRANCH(branch_id),formData);

//       if (response.data) {
//         await handleFetchBranch();
//         SuccessAlert(t("update_success"), 1500, "success");
//         onClose();
//       }
//     } catch (error) {
//       console.error("Update Branch failed:", error);
//       const errorMessage = error.response?.data?.message || t("update_failed");
//       SuccessAlert(errorMessage, 2000, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to check if form has changes
//   const hasChanges = () => {
//     return isDirty;
//   };

//   return {
//     register,
//     handleSubmit,
//     // setValue,
//     errors,
//     // imageFile,
//     loading,
//     submitForm,
//     // existingImage,
//     // clearImage,
//     formState: { isDirty, errors },
//     hasChanges,
//     reset
//   };
// };


import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";

import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";

/* =========================================================
   Branch Schema
========================================================= */

export const BranchSchema = (t) =>
  z.object({
    /* -----------------------------------------------------
       Branch Name
    ----------------------------------------------------- */

    branch_name: z
      .string()
      .min(1, { message: t("title_required") })
      .min(2, { message: t("min_length_2") })
      .max(100, { message: t("max_length_100") }),

    /* -----------------------------------------------------
       Location / Address
    ----------------------------------------------------- */

    location: z
      .string()
      .min(1, { message: t("location_required") })
      .min(5, { message: t("min_length_5") })
      .max(500, { message: t("max_length_500") }),

    /* -----------------------------------------------------
       Phone (optional)
    ----------------------------------------------------- */

    phone: z
      .string()
      .max(15, { message: t("phone_max_length_15") })
      .refine(
        (value) => {
          if (!value || value.trim() === "") return true;
          return value.trim().length >= 8;
        },
        { message: t("phone_min_length_8") }
      )
      .optional(),

    /* -----------------------------------------------------
       Latitude  (-90 to 90)
    ----------------------------------------------------- */

    latitude: z
      .string()
      .min(1, { message: t("latitude_required") })
      .refine(
        (value) => {
          const number = Number(value);
          return (
            Number.isFinite(number) && number >= -90 && number <= 90
          );
        },
        { message: t("latitude_invalid") }
      ),

    /* -----------------------------------------------------
       Longitude  (-180 to 180)
    ----------------------------------------------------- */

    longitude: z
      .string()
      .min(1, { message: t("longitude_required") })
      .refine(
        (value) => {
          const number = Number(value);
          return (
            Number.isFinite(number) && number >= -180 && number <= 180
          );
        },
        { message: t("longitude_invalid") }
      ),
  });

/* =========================================================
   useEditBranchForm
========================================================= */

export const useEditBranchForm = ({
  onClose,
  branch_id,
  handleFetchBranch,
}) => {
  const { t } = useTranslation("branch");
  const [loading, setLoading] = useState(false);

  /* =======================================================
     React Hook Form
  ======================================================= */

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(BranchSchema(t)),
    defaultValues: {
      branch_name: "",
      location: "",
      phone: "",
      latitude: "",
      longitude: "",
    },
    mode: "onSubmit",
  });

  /* =======================================================
     Load Branch By ID
  ======================================================= */

  useEffect(() => {
    const fetchDataById = async () => {
      if (!branch_id) return;

      setLoading(true);

      try {
        const res = await axiosInstance.get(
          APIPath.SELECT_ONE_BRANCH(branch_id)
        );

        const data = res?.data?.data;

        if (data) {
          reset({
            branch_name: data.branch_name ?? "",
            location: data.location ?? "",
            phone: data.phone ?? "",
            // API may return numbers/null — the form works with strings
            latitude:
              data.latitude !== null && data.latitude !== undefined
                ? String(data.latitude)
                : "",
            longitude:
              data.longitude !== null && data.longitude !== undefined
                ? String(data.longitude)
                : "",
          });
        }
      } catch (error) {
        console.error("Error fetching Branch:", error);
        SuccessAlert(t("fetch_error"), 2000, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDataById();
  }, [branch_id, reset, t]);

  /* =======================================================
     Submit
  ======================================================= */

  const submitForm = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("branch_name", data.branch_name.trim());
      formData.append("location", data.location.trim());
      formData.append("phone", data.phone ? data.phone.trim() : "");
      formData.append("latitude", String(data.latitude).trim());
      formData.append("longitude", String(data.longitude).trim());

      const response = await axiosInstance.put(
        APIPath.UPDATE_BRANCH(branch_id),
        formData
      );

      if (response.data) {
        await handleFetchBranch();
        SuccessAlert(t("update_success"), 1500, "success");
        onClose();
      }
    } catch (error) {
      console.error("Update Branch failed:", error);

      const errorMessage =
        error?.response?.data?.message || t("update_failed");

      SuccessAlert(errorMessage, 2000, "error");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     Helpers
  ======================================================= */

  const hasChanges = () => isDirty;

  /* =======================================================
     Return
  ======================================================= */

  return {
    register,
    handleSubmit,
    errors,
    loading,
    submitForm,
    reset,
    getValues,
    setValue,
    watch,
    hasChanges,
    formState: { isDirty, errors },
  };
};