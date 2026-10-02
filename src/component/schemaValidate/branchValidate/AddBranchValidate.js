// // // import { useState } from "react";
// // // import { useForm } from "react-hook-form";
// // // import { zodResolver } from "@hookform/resolvers/zod";
// // // import { z } from "zod";
// // // import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// // // import APIPath from "../../../api/APIPath";
// // // import { useTranslation } from "react-i18next";
// // // import axiosInstance from "../../../utils/AxiosInstance";
// // // import useToyotaStore from "../../../store/ToyotaStore";

// // // // Zod schema with proper validation
// // // const branchSchema = (t) => z.object({
// // //   branch_name: z
// // //     .string()
// // //     .min(1, { message: t("title_required") })
// // //     .min(2, { message: t("min_length_2") })
// // //     .max(100, { message: t("max_length_100") }),
// // //   location: z
// // //     .string()
// // //     .min(1, { message: t("location_required") })
// // //     .min(5, { message: t("min_length_5") })
// // //     .max(500, { message: t("max_length_500") }),
// // //   phone: z
// // //     .string()
// // //     .min(8, { message: t("phone_min_length_8") })
// // //     .max(15, { message: t("phone_max_length_15") })
// // //     .optional()
// // // });

// // // export const useAddBranchForm = ({ onClose, handleFetchBranch }) => {
// // //   const [loading, setLoading] = useState(false);
// // //   const { t } = useTranslation("branch");
// // //   const userId = useToyotaStore((state) => state.getUserId());


// // //   const form = useForm({
// // //     resolver: zodResolver(branchSchema(t)),
// // //     defaultValues: {
// // //       userId: "",
// // //       branch_name: "",
// // //       location: "",
// // //       phone: "",
// // //     }
// // //   });

// // //   const { register, handleSubmit,  reset, formState: { errors } } = form;


// // //   const onSubmit = async (data) => {
// // //     try {
// // //       setLoading(true);

// // //       const dataForm = new FormData();
// // //       dataForm.append("userId", userId.trim());
// // //       dataForm.append("branch_name", data.branch_name.trim());
// // //       dataForm.append("location", data.location.trim());
// // //       dataForm.append("phone", data.phone.trim());


// // //       const response = await axiosInstance.post(APIPath.CREATE_BRANCH, dataForm);

// // //       if (response.data) {
// // //         await handleFetchBranch();
// // //         SuccessAlert(t("add_success"), 1500, "success");
// // //         reset(); // Reset form using react-hook-form's reset
// // //         onClose();
// // //       }
// // //     } catch (error) {
// // //       console.error("Create Branch failed:", error);
// // //       const errorMessage = error.response?.data?.message || t("add_failed");
// // //       SuccessAlert(errorMessage, 2000, "error");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };


// // //   return {
// // //     register,
// // //     handleSubmit,
// // //     errors,
// // //     loading,
// // //     onSubmit,
// // //     reset,
// // //   };
// // // };



// // import { useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { z } from "zod";
// // import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// // import APIPath from "../../../api/APIPath";
// // import { useTranslation } from "react-i18next";
// // import axiosInstance from "../../../utils/AxiosInstance";
// // import useToyotaStore from "../../../store/ToyotaStore";

// // // Allow an empty optional coordinate, or validate its numeric value.
// // const coordinateSchema = (min, max, label) =>
// //   z
// //     .string()
// //     .trim()
// //     .refine(
// //       (value) =>
// //         value === "" ||
// //         (Number.isFinite(Number(value)) &&
// //           Number(value) >= min &&
// //           Number(value) <= max),
// //       {
// //         message: `${label} must be between ${min} and ${max}.`,
// //       }
// //     );

// // const branchSchema = (t) =>
// //   z.object({
// //     branch_name: z
// //       .string()
// //       .trim()
// //       .min(1, { message: t("title_required") })
// //       .min(2, { message: t("min_length_2") })
// //       .max(100, { message: t("max_length_100") }),

// //     location: z
// //       .string()
// //       .trim()
// //       .min(1, { message: t("location_required") })
// //       .min(5, { message: t("min_length_5") })
// //       .max(500, { message: t("max_length_500") }),

// //     phone: z
// //       .string()
// //       .trim()
// //       .refine(
// //         (value) => value === "" || value.length >= 8,
// //         { message: t("phone_min_length_8") }
// //       )
// //       .refine(
// //         (value) => value === "" || value.length <= 15,
// //         { message: t("phone_max_length_15") }
// //       ),

// //     latitude: coordinateSchema(-90, 90, "Latitude"),
// //     longitude: coordinateSchema(-180, 180, "Longitude"),
// //   });

// // export const useAddBranchForm = ({ onClose, handleFetchBranch }) => {
// //   const [loading, setLoading] = useState(false);
// //   const { t } = useTranslation("branch");

// //   const userId = useToyotaStore((state) => state.getUserId());

// //   const form = useForm({
// //     resolver: zodResolver(branchSchema(t)),
// //     defaultValues: {
// //       branch_name: "",
// //       location: "",
// //       phone: "",
// //       latitude: "",
// //       longitude: "",
// //     },
// //   });

// //   const {
// //     register,
// //     handleSubmit,
// //     reset,
// //     setValue,
// //     watch,
// //     formState: { errors },
// //   } = form;

// //   const onSubmit = async (data) => {
// //     try {
// //       setLoading(true);

// //       const dataForm = new FormData();

// //       dataForm.append("userId", String(userId ?? "").trim());
// //       dataForm.append("branch_name", data.branch_name.trim());
// //       dataForm.append("location", data.location.trim());
// //       dataForm.append("phone", (data.phone ?? "").trim());

// //       // Empty coordinates are sent as empty strings.
// //       // The backend should convert empty strings to null.
// //       dataForm.append("latitude", data.latitude?.trim() ?? "");
// //       dataForm.append("longitude", data.longitude?.trim() ?? "");

// //       const response = await axiosInstance.post(
// //         APIPath.CREATE_BRANCH,
// //         dataForm
// //       );

// //       if (response.data) {
// //         await handleFetchBranch();

// //         SuccessAlert(t("add_success"), 1500, "success");

// //         reset({
// //           branch_name: "",
// //           location: "",
// //           phone: "",
// //           latitude: "",
// //           longitude: "",
// //         });

// //         onClose();
// //       }
// //     } catch (error) {
// //       console.error("Create Branch failed:", error);

// //       const errorMessage =
// //         error.response?.data?.message || t("add_failed");

// //       SuccessAlert(errorMessage, 2000, "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return {
// //     register,
// //     handleSubmit,
// //     errors,
// //     loading,
// //     onSubmit,
// //     reset,
// //     setValue,
// //     watch,
// //   };
// // };


// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// import APIPath from "../../../api/APIPath";
// import { useTranslation } from "react-i18next";
// import axiosInstance from "../../../utils/AxiosInstance";
// import useToyotaStore from "../../../store/ToyotaStore";

// const coordinateSchema = (min, max, label) =>
//   z
//     .string()
//     .trim()
//     .refine(
//       (value) =>
//         value === "" ||
//         (Number.isFinite(Number(value)) &&
//           Number(value) >= min &&
//           Number(value) <= max),
//       {
//         message: `${label} must be between ${min} and ${max}.`,
//       }
//     );

// const branchSchema = (t) =>
//   z.object({
//     branch_name: z
//       .string()
//       .trim()
//       .min(1, { message: t("title_required") })
//       .min(2, { message: t("min_length_2") })
//       .max(100, { message: t("max_length_100") }),

//     location: z
//       .string()
//       .trim()
//       .min(1, { message: t("location_required") })
//       .min(5, { message: t("min_length_5") })
//       .max(500, { message: t("max_length_500") }),

//     phone: z
//       .string()
//       .trim()
//       .refine(
//         (value) => value === "" || value.length >= 8,
//         {
//           message: t("phone_min_length_8"),
//         }
//       )
//       .refine(
//         (value) => value === "" || value.length <= 15,
//         {
//           message: t("phone_max_length_15"),
//         }
//       ),

//     latitude: coordinateSchema(
//       -90,
//       90,
//       "Latitude"
//     ),

//     longitude: coordinateSchema(
//       -180,
//       180,
//       "Longitude"
//     ),
//   });

// export const useAddBranchForm = ({
//   onClose,
//   handleFetchBranch,
// }) => {
//   const [loading, setLoading] = useState(false);

//   const { t } = useTranslation("branch");

//   const userId = useToyotaStore(
//     (state) => state.getUserId()
//   );

//   const form = useForm({
//     resolver: zodResolver(branchSchema(t)),

//     defaultValues: {
//       branch_name: "",
//       location: "",
//       phone: "",
//       latitude: "",
//       longitude: "",
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//      getValues,
//     formState: { errors },
//   } = form;

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);

//       const dataForm = new FormData();

//       dataForm.append(
//         "userId",
//         String(userId ?? "").trim()
//       );

//       dataForm.append(
//         "branch_name",
//         data.branch_name.trim()
//       );

//       dataForm.append(
//         "location",
//         data.location.trim()
//       );

//       dataForm.append(
//         "phone",
//         data.phone?.trim() ?? ""
//       );

//       dataForm.append(
//         "latitude",
//         data.latitude?.trim() ?? ""
//       );

//       dataForm.append(
//         "longitude",
//         data.longitude?.trim() ?? ""
//       );

//       const response = await axiosInstance.post(
//         APIPath.CREATE_BRANCH,
//         dataForm
//       );

//       if (response.data) {
//         await handleFetchBranch();

//         SuccessAlert(
//           t("add_success"),
//           1500,
//           "success"
//         );

//         reset({
//           branch_name: "",
//           location: "",
//           phone: "",
//           latitude: "",
//           longitude: "",
//         });

//         onClose();
//       }
//     } catch (error) {
//       console.error(
//         "Create Branch failed:",
//         error
//       );

//       const errorMessage =
//         error.response?.data?.message ||
//         t("add_failed");

//       SuccessAlert(
//         errorMessage,
//         2000,
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     register,
//     handleSubmit,
//     errors,
//     loading,
//     onSubmit,
//     reset,
//     watch,
//     getValues
//   };
// };


import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";
import { z } from "zod";

import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import APIPath from "../../../api/APIPath";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/AxiosInstance";
import useToyotaStore from "../../../store/ToyotaStore";

/* =========================================================
   Branch Schema
========================================================= */

const branchSchema = (t) =>
  z.object({
    /* -----------------------------------------------------
       Branch Name
    ----------------------------------------------------- */

    branch_name: z
      .string()
      .min(1, {
        message: t("title_required"),
      })
      .min(2, {
        message: t("min_length_2"),
      })
      .max(100, {
        message: t("max_length_100"),
      }),

    /* -----------------------------------------------------
       Location / Address
    ----------------------------------------------------- */

    location: z
      .string()
      .min(1, {
        message: t("location_required"),
      })
      .min(5, {
        message: t("min_length_5"),
      })
      .max(500, {
        message: t("max_length_500"),
      }),

    /* -----------------------------------------------------
       Phone
    ----------------------------------------------------- */

    phone: z
      .string()
      .max(15, {
        message: t("phone_max_length_15"),
      })
      .refine(
        (value) => {
          if (!value || value.trim() === "") {
            return true;
          }

          return value.trim().length >= 8;
        },
        {
          message: t("phone_min_length_8"),
        }
      )
      .optional(),

    /* -----------------------------------------------------
       Latitude
       Range: -90 to 90
    ----------------------------------------------------- */

    latitude: z
      .string()
      .min(1, {
        message: t("latitude_required"),
      })
      .refine(
        (value) => {
          const number = Number(value);

          return (
            Number.isFinite(number) &&
            number >= -90 &&
            number <= 90
          );
        },
        {
          message: t("latitude_invalid"),
        }
      ),

    /* -----------------------------------------------------
       Longitude
       Range: -180 to 180
    ----------------------------------------------------- */

    longitude: z
      .string()
      .min(1, {
        message: t("longitude_required"),
      })
      .refine(
        (value) => {
          const number = Number(value);

          return (
            Number.isFinite(number) &&
            number >= -180 &&
            number <= 180
          );
        },
        {
          message: t("longitude_invalid"),
        }
      ),
  });

/* =========================================================
   useAddBranchForm
========================================================= */

export const useAddBranchForm = ({
  onClose,
  handleFetchBranch,
}) => {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation("branch");

  /* =======================================================
     User ID
  ======================================================= */

  const userId = useToyotaStore(
    (state) => state.getUserId()
  );

  /* =======================================================
     React Hook Form
  ======================================================= */

  const form = useForm({
    resolver: zodResolver(
      branchSchema(t)
    ),

    defaultValues: {
      userId: "",
      branch_name: "",
      location: "",
      phone: "",
      latitude: "",
      longitude: "",
    },

    mode: "onSubmit",
  });

  /* =======================================================
     Form Methods
  ======================================================= */

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,

    formState: {
      errors,
    },
  } = form;

  /* =======================================================
     Submit
  ======================================================= */

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      /* ---------------------------------------------------
         FormData
      --------------------------------------------------- */

      const dataForm = new FormData();

      /* ---------------------------------------------------
         User ID
      --------------------------------------------------- */

      dataForm.append(
        "userId",
        String(userId ?? "").trim()
      );

      /* ---------------------------------------------------
         Branch Name
      --------------------------------------------------- */

      dataForm.append(
        "branch_name",
        data.branch_name.trim()
      );

      /* ---------------------------------------------------
         Location
      --------------------------------------------------- */

      dataForm.append(
        "location",
        data.location.trim()
      );

      /* ---------------------------------------------------
         Phone
      --------------------------------------------------- */

      dataForm.append(
        "phone",
        data.phone
          ? data.phone.trim()
          : ""
      );

      /* ---------------------------------------------------
         Latitude
      --------------------------------------------------- */

      dataForm.append(
        "latitude",
        String(data.latitude).trim()
      );

      /* ---------------------------------------------------
         Longitude
      --------------------------------------------------- */

      dataForm.append(
        "longitude",
        String(data.longitude).trim()
      );

      /* ===================================================
         API Request
      =================================================== */

      const response =
        await axiosInstance.post(
          APIPath.CREATE_BRANCH,
          dataForm
        );

      /* ===================================================
         Success
      =================================================== */

      if (response.data) {
        await handleFetchBranch();

        SuccessAlert(
          t("add_success"),
          1500,
          "success"
        );

        reset({
          userId: "",
          branch_name: "",
          location: "",
          phone: "",
          latitude: "",
          longitude: "",
        });

        onClose();
      }
    } catch (error) {
      console.error(
        "Create Branch failed:",
        error
      );

      const errorMessage =
        error?.response?.data?.message ||
        t("add_failed");

      SuccessAlert(
        errorMessage,
        2000,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     Return
  ======================================================= */

  return {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    reset,
    getValues,
    setValue,
  };
};