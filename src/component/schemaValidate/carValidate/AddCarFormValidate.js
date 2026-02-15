import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '../../../utils/AxiosInstance';
import APIPath from '../../../api/APIPath';
import { SuccessAlert } from '../../../utils/handleAlert/SuccessAlert';
import { useTranslation } from 'react-i18next';


const addCarSchema = (t) => z.object({
//   userId: z.string().min(2, t("min_length_2")),
  model: z.string().min(2, t("min_length_2")),
  engineNumber: z.string().min(2, t("min_length_2")),
  frameNumber: z.string().min(2, t("min_length_2")),
  plateNumber: z.string().min(2, t("min_length_2")),
  province: z.string().min(2, t("min_length_2")),
  color: z.string().min(2, t("min_length_2")),
});

export const useAddCarForm = ({handleFetchCar, onClose}) => {
    const { t } = useTranslation("auth");
    const [users, setUsers] = useState([]);
    const { register,handleSubmit,formState: { errors },reset,} = useForm({resolver: zodResolver(addCarSchema(t)),});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get(APIPath.SELECT_ALL_USER);
                setUsers(res?.data?.data || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

    const onSubmit = async (data) => {
        try {
            await axiosInstance.post(APIPath.CREATE_CAR, data);
            handleFetchCar();
            onClose();
            SuccessAlert(t("add_success"));
            reset();
        } catch (error) {
            SuccessAlert(t("add_failed"), 1500, "warning");
            console.error('Error adding car:', error);
        }
    };

    const handleBack = () => {
        reset();
        onClose();
    };


    return { register,handleSubmit,formState: { errors },users, onSubmit, handleBack, reset,  };
}