import Spinner from "../../utils/Loading";
import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import { useTranslation } from "react-i18next";
import { useAddEmployeeForm } from "../../component/schemaValidate/employeeValidate/AddEmployeeValidate";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";


const AddEmployee = ({ show, onClose, handleFetchEmployee }) => {
  const { t } = useTranslation("employee"); // namespace 'employee'
  const [branches, setBranches] = useState([]);
  const [user, setUser] = useState([]);
  const { register, handleSubmit, formState: { errors }, loading, onSubmit } = useAddEmployeeForm({ onClose, handleFetchEmployee });




  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get(APIPath.SELECT_ALL_BRANCH);
      setBranches(response?.data?.data);

    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(APIPath.SELECT_ALL_USER);
      setUser(response?.data?.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchUser();
  }, []);



  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
          {t("add_employee")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-full h-20">
              <input
                type="text"
                placeholder={t("employee_name")}
                {...register("employee_name")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              {errors.employee_name && <p className="text-red-500">{errors.employee_name.message}</p>}
            </div>

            <div className="w-full h-20">
              <input
                type="text"
                placeholder={t("position")}
                {...register("position")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              />
              {errors.position && <p className="text-red-500">{errors.position.message}</p>}
            </div>
            <div className="w-full h-20">
              <select
                {...register("branchId")}
                defaultValue=""
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              >
                <option value="" disabled>{t("selectBranch")}</option>
                {branches.length > 0 ? branches.map(branch => (
                  <option key={branch.branch_id} value={branch.branch_id}>{branch.branch_name}</option>
                )) : <option value="">{t("noBranch")}</option>}
              </select>
              <div className="h-6">
                {errors.branchId && <p className="text-red-500 text-sm">{errors.branchId.message}</p>}
              </div>
            </div>
            <div className="w-full h-20">
              <select
                {...register("userId")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg outline-none hover:border-blue-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm transition-colors"
              >
                <option value="" disabled>{t("selectUser")}</option>
                {user.length > 0 ? user.filter(user => user.role !== "general").map(user => (
                  <option key={user.user_id} value={user.user_id}>{user.username}</option>
                )) : <option value="">{t("noUser")}</option>}
              </select>
              <div className="h-6">
                {errors.userId && <p className="text-red-500 text-sm">{errors.userId.message}</p>}
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-3">
            <button
              type="button"
              onClick={() => {
                SuccessAlert(t("cancel_add"));
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm"
              disabled={loading}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Spinner size="5" color="white" /> : t("submit")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEmployee;
