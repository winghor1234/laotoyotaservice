import { useState, useEffect, useCallback } from "react";

const useServerFilterPagination = ({
    apiCall,
    limit = 10,
    enabled = true,
    status,
}) => {
    // ===============================
    // State
    // ===============================
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);

    // ===============================
    // Fetch
    // ===============================
    const fetchData = useCallback(async () => {
        if (enabled !== true) return;
        try {
            setLoading(true);
            const res = await apiCall({ page, limit, search, startDate, endDate, status });
            const result = res?.data?.data || {};
            // console.log("result", result);

            setData(result?.data || []);
            setTotalPage(Number(result.totalPage) || 1);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [apiCall, page, limit, search, startDate, endDate, enabled, status]);
    // console.log("page", page);

    useEffect(() => {
        fetchData();
    }, [page, search, startDate, endDate]);

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

    const getPageNumbers = () => {
        const pages = [];
        // กำหนดจำนวนปุ่มที่จะโชว์ (เช่น 3 ปุ่ม)
        const showAmount = 3;

        let startPage = Math.max(1, page - 1);
        let endPage = Math.min(totalPage, startPage + showAmount - 1);

        // ปรับจูนเพื่อให้แสดงครบจำนวนปุ่มที่ตั้งไว้เสมอ (ถ้าหน้าทั้งหมดพอ)
        if (endPage - startPage < showAmount - 1) {
            startPage = Math.max(1, endPage - showAmount + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return {
        data,
        limit,
        page,
        totalPage,
        search,
        startDate,
        endDate,
        loading,
        handleSearch,
        handleDateChange,
        handlePageChange,
        fetchData,
        getPageNumbers,
    };
};

export default useServerFilterPagination;

