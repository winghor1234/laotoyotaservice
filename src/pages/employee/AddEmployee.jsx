// import Spinner from "../../utils/Loading";
// import { SuccessAlert } from "../../utils/handleAlert/SuccessAlert";
// import { useTranslation } from "react-i18next";
// import { useAddEmployeeForm } from "../../component/schemaValidate/employeeValidate/AddEmployeeValidate";
// import APIPath from "../../api/APIPath";


// const AddEmployee = ({ show, onClose, handleFetchEmployee }) => {
//   const { t } = useTranslation("employee"); 
//   const { register, handleSubmit, formState: { errors }, loading, onSubmit, branches, user } = useAddEmployeeForm({ onClose, handleFetchEmployee });



//   if (!show) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-sm transition-all">
//         <h2 className="text-lg sm:text-xl font-bold text-center mb-4">
//           {t("add_employee")}
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//             {/* Employee Name */}
//             <div className="w-full min-h-[80px]">
//               <input
//                 type="text"
//                 placeholder={t("employee_name")}
//                 {...register("employee_name")}
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-colors"
//               />
//               {errors.employee_name && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.employee_name.message}
//                 </p>
//               )}
//             </div>

//             {/* Position */}
//             <div className="w-full min-h-[80px]">
//               <input
//                 type="text"
//                 placeholder={t("position")}
//                 {...register("position")}
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-colors"
//               />
//               {errors.position && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.position.message}
//                 </p>
//               )}
//             </div>

//             {/* Branch */}
//             <div className="w-full min-h-[80px]">
//               <select
//                 {...register("branchId")}
//                 defaultValue=""
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-colors"
//               >
//                 <option value="" disabled>
//                   {t("selectBranch")}
//                 </option>

//                 {branches.length > 0 ? (
//                   branches.map((branch) => (
//                     <option
//                       key={branch.branch_id}
//                       value={branch.branch_id}
//                     >
//                       {branch.branch_name}
//                     </option>
//                   ))
//                 ) : (
//                   <option value="">
//                     {t("noBranch")}
//                   </option>
//                 )}
//               </select>

//               {errors.branchId && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.branchId.message}
//                 </p>
//               )}
//             </div>

//             {/* User */}
//             <div className="w-full min-h-[80px]">
//               <select
//                 {...register("userId")}
//                 defaultValue=""
//                 className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base outline-none hover:border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-sm transition-colors"
//               >
//                 <option value="" disabled>
//                   {t("selectUser")}
//                 </option>

//                 {user.length > 0 ? (
//                   user
//                     .filter((item) => item.role !== "general" && item.Employee.length === 0)
//                     .map((item) => (
//                       <option
//                         key={item.user_id}
//                         value={item.user_id}
//                       >
//                         {item.username}
//                       </option>
//                     ))
//                 ) : (
//                   <option value="">
//                     {t("noUser")}
//                   </option>
//                 )}
//               </select>

//               {errors.userId && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.userId.message}
//                 </p>
//               )}
//             </div>

//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm"
//               disabled={loading}
//             >
//               {t("cancel")}
//             </button>

//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-28 h-10 cursor-pointer transition-colors text-sm flex items-center justify-center gap-2"
//               disabled={loading}
//             >
//               {loading ? (
//                 <Spinner size="5" color="white" />
//               ) : (
//                 t("submit")
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddEmployee;


import Spinner from "../../utils/Loading";
import { useTranslation } from "react-i18next";
import { useAddEmployeeForm } from "../../component/schemaValidate/employeeValidate/AddEmployeeValidate";
import { X } from "lucide-react";

const AddEmployee = ({ show, onClose, handleFetchEmployee }) => {
  const { t } = useTranslation("employee");
  const {
    register, handleSubmit, errors, loading, onSubmit, branches, user, setValue,
    userSearch, setUserSearch, userShowDropdown, setUserShowDropdown, selectedUser, setSelectedUser, userDropdownRef,
    branchSearch, setBranchSearch, branchShowDropdown, setBranchShowDropdown, selectedBranch, setSelectedBranch, branchDropdownRef
  } = useAddEmployeeForm({ onClose, handleFetchEmployee });

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-30 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 text-sm">
        <h2 className="text-xl font-bold text-center mb-6">{t("add_employee")}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Employee Name */}
            <div className="flex flex-col">
              <input
                {...register("employee_name")}
                placeholder={t("employee_name")}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:border-red-600 shadow-sm"
              />
              {errors.employee_name && <p className="text-red-500 text-xs mt-1">{errors.employee_name.message}</p>}
            </div>

            {/* Position */}
            <div className="flex flex-col">
              <input
                {...register("position")}
                placeholder={t("position")}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:border-red-600 shadow-sm"
              />
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
            </div>

            {/* Searchable Branch */}
            <div ref={branchDropdownRef} className="flex flex-col relative">
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
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                    onClick={() => { setBranchSearch(""); setValue("branchId", ""); setSelectedBranch(null); }}>
                    <X size={18} />
                  </button>
                )}
              </div>
              {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>}

              {branchShowDropdown && !selectedBranch && (
                <div className="absolute z-10 top-[52px] w-full bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto shadow-xl">
                  {branches.filter(b => b.branch_name.toLowerCase().includes(branchSearch.toLowerCase())).map(b => (
                    <div key={b.branch_id} className="px-4 py-2 hover:bg-red-50 cursor-pointer"
                      onClick={() => { setBranchSearch(b.branch_name); setSelectedBranch(b); setValue("branchId", b.branch_id); setBranchShowDropdown(false); }}>
                      {b.branch_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Searchable User (Filtered: role != general & no employee) */}
            <div ref={userDropdownRef} className="flex flex-col relative">
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
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                    onClick={() => { setUserSearch(""); setValue("userId", ""); setSelectedUser(null); }}>
                    <X size={18} />
                  </button>
                )}
              </div>
              {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>}

              {userShowDropdown && !selectedUser && (
                <div className="absolute z-10 top-[52px] w-full bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto shadow-xl">
                  {user.filter(u => {
                    const noEmployee = !u.Employee || u.Employee.length === 0;
                    const notGeneral = u.role !== "general";
                    const matchText = u.username.toLowerCase().includes(userSearch.toLowerCase());
                    return noEmployee && notGeneral && matchText;
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
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-2 rounded-lg transition-colors h-11 min-w-[120px]">
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

export default AddEmployee;