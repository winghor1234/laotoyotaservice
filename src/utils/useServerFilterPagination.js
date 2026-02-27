import { useState, useEffect, useCallback } from "react";

const useServerFilterPagination = ({ apiCall, limit = 2 }) => {
    // ===============================
    // State
    // ===============================
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // ===============================
    // Fetch
    // ===============================
    const fetchData = useCallback(async () => {
        try {
            const res = await apiCall({ page, limit, search, startDate, endDate, });
            const result = res?.data?.data || [];
            console.log("result :", result);

            setData(result?.data || []);
            setTotalPage(Number(result.totalPage) || 1);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [apiCall, page, limit, search, startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [page, search, startDate, endDate]);
    // console.log("data :", data);

    // ===============================
    // Handlers
    // ===============================
    const handleSearch = (value) => {
        setPage(1);
        setSearch(value);
    };

    const handleDateChange = ({ startDate, endDate }) => {
        setPage(1);
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setPage(newPage);
        }
    };
    return { data, limit, page, totalPage, search, startDate, endDate, handleSearch, handleDateChange, handlePageChange, fetchData, };
};

export default useServerFilterPagination;