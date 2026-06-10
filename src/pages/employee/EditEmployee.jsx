import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";
import { useEditEmployeeForm } from "../../component/schemaValidate/employeeValidate/EditEmployeeValidate";
import AxiosInstance from "../../utils/AxiosInstance";
import APIPath from "../../api/APIPath";
import { X } from "lucide-react";

const EditEmployee = ({ show, onClose, employee_id, handleFetchEmployee }) => {
  const { t } = useTranslation("employee");
  const { register,
    handleSubmit,
    submitForm, loading,
    formState: { errors },
    branches,
    user,
    watch,
    setValue,
    userSearch,
    setUserSearch,
    userShowDropdown,
    setUserShowDropdown,
    selectedUser,
    setSelectedUser,
    userDropdownRef,
    branchSearch,
    setBranchSearch,
    branchShowDropdown,
    setBranchShowDropdown,
    selectedBranch,
    setSelectedBranch,
    branchDropdownRef, } = useEditEmployeeForm({ onClose, handleFetchEmployee, employee_id });
  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 text-sm">
        <h2 className="text-xl font-bold text-center mb-6">{t("edit_employee")}</h2>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Employee Name */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">{t("employee_name")}</label>
              <input
                {...register("employee_name")}
                placeholder={t("employee_name")}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:border-red-600 shadow-sm"
              />
              {errors.employee_name && <p className="text-red-500 text-xs mt-1">{errors.employee_name.message}</p>}
            </div>

            {/* Position */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">{t("position")}</label>

              <input
                {...register("position")}
                placeholder={t("position")}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:border-red-600 shadow-sm"
              />
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
            </div>

            {/* Branch Selector */}
            <div ref={branchDropdownRef} className="flex flex-col relative">
              <label className="mb-1 font-medium">{t("select_branch")}</label>
              <input type="hidden" {...register("branchId")} />
              <div className="relative">
                <input
                  type="text"
                  value={branchSearch}
                  placeholder={t("select_branch")}
                  onChange={(e) => {
                    setBranchSearch(e.target.value);
                    setSelectedBranch(null);
                    setBranchShowDropdown(true);
                  }}
                  onFocus={() => !selectedBranch && setBranchShowDropdown(true)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:border-red-600 shadow-sm"
                />
                {branchSearch && (
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => { setBranchSearch(""); setValue("branchId", ""); setSelectedBranch(null); setBranchShowDropdown(true); }}>
                    <X size={18} />
                  </button>
                )}
              </div>
              {branchShowDropdown && !selectedBranch && (
                <div className="absolute z-10 top-[75px] w-full bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto shadow-xl">
                  {branches.filter(b => b.branch_name.toLowerCase().includes(branchSearch.toLowerCase())).map(b => (
                    <div key={b.branch_id} className="px-4 py-2 hover:bg-red-50 cursor-pointer"
                      onClick={() => { setBranchSearch(b.branch_name); setSelectedBranch(b); setValue("branchId", b.branch_id); setBranchShowDropdown(false); }}>
                      {b.branch_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Selector */}
            <div ref={userDropdownRef} className="flex flex-col relative">
              <label className="mb-1 font-medium">{t("select_user")}</label>
              <input type="hidden" {...register("userId")} />
              <div className="relative">
                <input
                  type="text"
                  value={userSearch}
                  placeholder={t("select_user")}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setSelectedUser(null);
                    setUserShowDropdown(true);
                  }}
                  onFocus={() => !selectedUser && setUserShowDropdown(true)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:border-red-600 shadow-sm"
                />
                {userSearch && (
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => { setUserSearch(""); setValue("userId", ""); setSelectedUser(null); setUserShowDropdown(true); }}>
                    <X size={18} />
                  </button>
                )}
              </div>
              {userShowDropdown && !selectedUser && (
                <div className="absolute z-10 top-[75px] w-full bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto shadow-xl">
                  {user.filter(u => {
                    const currentIdInForm = watch("userId");
                    if (u.role === "general") return false;
                    if (u.Employee?.length > 0 && u.user_id !== currentIdInForm) return false;
                    return u.username.toLowerCase().includes(userSearch.toLowerCase());
                  }).map(u => (
                    <div key={u.user_id} className="px-4 py-2 hover:bg-red-50 cursor-pointer"
                      onClick={() => { setUserSearch(u.username); setSelectedUser(u); setValue("userId", u.user_id); setUserShowDropdown(false); }}>
                      {u.username}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg transition-colors h-11 min-w-[120px]">
              {t("cancel")}
            </button>
            <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-lg flex items-center justify-center gap-2 h-11 min-w-[120px]">
              {loading ? <Spinner size="5" color="white" /> : t("submit")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditEmployee;