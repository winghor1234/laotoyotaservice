import { useState, useRef} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, ChevronDown, Search } from "lucide-react";
import { useTranslation } from "react-i18next";


export default function SelectDate({ onSearch, placeholder = "ຄົ້ນຫາ...", onDateChange }) {
  const [search, setSearch] = useState("");
  const { t } = useTranslation("util");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onDateChange?.({ startDate: date, endDate });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateChange?.({ startDate, endDate: date });
  };
  

  // console.log("Selected Start Date:", startDate);
  // console.log("Selected End Date:", endDate);

  const handleIconClick = (ref) => {
    if (ref.current) ref.current.setFocus();
  };
    const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value); // ส่ง query กลับไป component หลัก

  };



  return (
    <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start flex-wrap gap-2 sm:gap-3 lg:gap-5 flex-1">
      {/* Start Date */}
      <div className="flex items-center justify-between min-w-[200px] sm:w-auto lg:w-64 h-12 sm:h-14 border border-gray-300 px-3 py-2 bg-white shadow-sm rounded">
        <div className="flex items-center gap-2 flex-1">
          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          <span className="font-semibold text-sm sm:text-base lg:text-md">{t("date_start")}</span>
          <div className="relative flex-1">
            <DatePicker
              ref={startDateRef}
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy/MM/dd"
              placeholderText={t("date_start_placeholder")}
              className="w-full outline-none cursor-pointer bg-transparent font-semibold text-sm sm:text-base lg:text-md"
            />
            <ChevronDown
              className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
              onClick={() => handleIconClick(startDateRef)}
            />
          </div>
        </div>
      </div>

      {/* End Date */}
      <div className="flex items-center justify-between min-w-[200px] sm:w-auto lg:w-64 h-12 sm:h-14 border border-gray-300 px-3 py-2 bg-white shadow-sm rounded">
        <div className="flex items-center gap-2 flex-1">
          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          <span className="font-semibold text-sm sm:text-base lg:text-md">{t("date_end")}</span>
          <div className="relative flex-1">
            <DatePicker
              ref={endDateRef}
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy/MM/dd"
              placeholderText={t("date_end_placeholder")}
              className="w-full outline-none cursor-pointer bg-transparent font-semibold text-sm sm:text-base lg:text-md"
            />
            <ChevronDown
              className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
              onClick={() => handleIconClick(endDateRef)}
            />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center min-w-[200px] sm:w-auto lg:w-64 h-12 sm:h-14 border border-gray-300 focus-within:border-blue-600 px-3 py-2 bg-white shadow-sm rounded">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2" />
        <input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder={placeholder}
          className="outline-none text-sm sm:text-base flex-1"
        />
      </div>
    </div>
  );
}


