import { useState } from "react";

const CustomerSearch = ({ users, setValue, t }) => {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredUsers = users.filter((user) =>
        `${user.customer_number} ${user.username}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="relative w-full">
            {/* Input Search */}
            <input
                type="text"
                value={search}
                placeholder={t("select_customer")}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                }}
                className="w-full h-[40px] rounded-lg text-sm border border-gray-300 px-3 outline-none hover:border-blue-500 focus:border-blue-500"
            />

            {/* Dropdown */}
            {showDropdown && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-[200px] overflow-y-auto shadow">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.user_id}
                            onClick={() => {
                                setSearch(`${user.customer_number} ${user.username}`);
                                setValue("userId", user.user_id); // set to react-hook-form
                                setShowDropdown(false);
                            }}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100"
                        >
                            {user.customer_number} {user.username}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerSearch;