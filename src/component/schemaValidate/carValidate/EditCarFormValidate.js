// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect, useRef, useState } from "react";
// import axiosInstance from "../../../utils/AxiosInstance";
// import APIPath from "../../../api/APIPath";
// import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
// import { useTranslation } from "react-i18next";



// const editCarSchema = (t) => z.object({
//     userId: z.string().optional(),
//     model: z.string().min(2, t("min_length_2")),
//     engineNumber: z.string().min(2, t("min_length_2")),
//     frameNumber: z.string().min(2, t("min_length_2")),
//     plateNumber: z.string().min(2, t("min_length_2")),
//     province: z.string().min(2, t("min_length_2")),
//     color: z.string().min(2, t("min_length_2")),
// });

// export const useEditCarForm = ({ carId, handleFetchCar, onClose }) => {
//     const { t } = useTranslation("auth");
//     const [users, setUsers] = useState([]);
//     const [car, setCar] = useState([]);
//     const [search, setSearch] = useState("");
//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef();
//     const { register, handleSubmit, reset, getValues, formState: { errors }, } = useForm({

//         resolver: zodResolver(editCarSchema(t))
//     });


//     useEffect(() => {
//         if (!carId) return;
//         Promise.all([
//             axiosInstance.get(APIPath.SELECT_ONE_CAR(carId)),
//             axiosInstance.get(APIPath.SELECT_ALL_USER),
//         ])
//             .then(([carResponse, usersResponse]) => {
//                 setUsers(usersResponse?.data?.data || []);

//                 const carData = carResponse?.data?.data;
//                 setCar(carData);
//                 if (carData) {
//                     reset({
//                         userId: String(carData?.user?.username) || "",
//                         model: carData?.model,
//                         engineNumber: carData?.engineNumber,
//                         frameNumber: carData?.frameNumber,
//                         plateNumber: carData?.plateNumber,
//                         province: carData?.province,
//                         color: carData?.color,
//                     });
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error fetching car details:", error);
//             });
//     }, [carId, reset]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowDropdown(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     // submit form
//     const submitForm = async (data) => {
//         console.log("submit data : ", data);
//         try {
//             await axiosInstance.put(APIPath.UPDATE_CAR(carId), data);
//             handleFetchCar();
//             SuccessAlert(t("update_success"));
//             onClose();
//         } catch (error) {
//             SuccessAlert(t("update_failed"), 1500, "warning");
//             console.error("Error updating car:", error);
//         }
//     };


//     return { register, handleSubmit, submitForm, formState: { errors }, users, reset, car, search, setSearch, showDropdown, setShowDropdown, dropdownRef, getValues };
// }



import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import APIPath from "../../../api/APIPath";
import { SuccessAlert } from "../../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";

const editCarSchema = (t) =>
    z.object({
        userId: z.string().optional(),
        model: z.string().min(2, t("min_length_2")),
        engineNumber: z.string().min(2, t("min_length_2")),
        frameNumber: z.string().min(2, t("min_length_2")),
        plateNumber: z.string().min(2, t("min_length_2")),
        province: z.string().min(2, t("min_length_2")),
        color: z.string().min(2, t("min_length_2")),
    });

export const useEditCarForm = ({
    carId,
    handleFetchCar,
    onClose,
}) => {

    const { t } = useTranslation("auth");

    const [users, setUsers] = useState([]);
    const [car, setCar] = useState(null);

    // search text for input display
    const [search, setSearch] = useState("");

    // selected user object
    const [selectedUser, setSelectedUser] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(editCarSchema(t)),
    });

    // fetch data
    useEffect(() => {

        if (!carId) return;

        Promise.all([
            axiosInstance.get(APIPath.SELECT_ONE_CAR(carId)),
            axiosInstance.get(APIPath.SELECT_ALL_USER),
        ])
            .then(([carResponse, usersResponse]) => {

                const usersData =
                    usersResponse?.data?.data || [];

                setUsers(usersData);

                const carData =
                    carResponse?.data?.data;

                setCar(carData);

                if (carData) {

                    // set search text
                    setSearch(
                        `${carData?.user?.customer_number || ""} ${carData?.user?.username || ""}`
                    );

                    // set selected user
                    setSelectedUser(carData?.user);

                    // set form values
                    reset({
                        userId: String(carData?.user?.user_id || ""),
                        model: carData?.model || "",
                        engineNumber:
                            carData?.engineNumber || "",
                        frameNumber:
                            carData?.frameNumber || "",
                        plateNumber:
                            carData?.plateNumber || "",
                        province:
                            carData?.province || "",
                        color:
                            carData?.color || "",
                    });
                }
            })
            .catch((error) => {
                console.error(
                    "Error fetching car details:",
                    error
                );
            });

    }, [carId, reset]);

    // close dropdown outside
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    // select user
    const handleSelectUser = (user) => {

        setSelectedUser(user);

        setSearch(
            `${user.customer_number} ${user.username}`
        );

        // IMPORTANT
        // save real userId into form
        setValue(
            "userId",
            String(user.user_id)
        );

        setShowDropdown(false);
    };

    // submit form
    const submitForm = async (data) => {

        console.log("submit data:", data);

        try {

            await axiosInstance.put(
                APIPath.UPDATE_CAR(carId),
                data
            );

            handleFetchCar();

            SuccessAlert(
                t("update_success")
            );

            onClose();

        } catch (error) {

            SuccessAlert(
                t("update_failed"),
                1500,
                "warning"
            );

            console.error(
                "Error updating car:",
                error
            );
        }
    };

    return {
        register,
        handleSubmit,
        submitForm,
        users,
        reset,
        car,

        // search
        search,
        setSearch,

        // selected user
        selectedUser,
        setSelectedUser,

        // dropdown
        showDropdown,
        setShowDropdown,
        dropdownRef,

        // helper
        handleSelectUser,
        setValue,
        getValues,

        // error
        errors,
    };
};