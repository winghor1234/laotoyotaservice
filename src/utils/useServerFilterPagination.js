// import { useState, useEffect, useCallback } from "react";

// const useServerFilterPagination = ({
//     apiCall,
//     limit = 10,
//     enabled = true,
//     status,
// }) => {
//     // ===============================
//     // State
//     // ===============================
//     const [data, setData] = useState([]);
//     const [page, setPage] = useState(1);
//     const [totalPage, setTotalPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // ===============================
//     // Fetch
//     // ===============================
//     const fetchData = useCallback(async () => {
//         if (enabled !== true) return;
//         try {
//             setLoading(true);
//             const res = await apiCall({ page, limit, search, startDate, endDate, status });
//             const result = res?.data?.data || {};
//             // const result = res || {};
//             // console.log("result", result);

//             setData(result?.data || []);
//             setTotalPage(Number(result.totalPage) || 1);
//         } catch (error) {
//             console.error("Fetch error:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [apiCall, page, limit, search, startDate, endDate, enabled, status]);


//     useEffect(() => {
//         fetchData();
//     }, [page, search, startDate, endDate, enabled, status]);

//     // ===============================
//     // Handlers
//     // ===============================
//     const handleSearch = (value) => {
//         setPage(1);
//         setSearch(value);
//     };

//     const handleDateChange = ({ startDate, endDate }) => {
//         setPage(1);
//         setStartDate(startDate);
//         setEndDate(endDate);
//     };
//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPage) {
//             setPage(newPage);
//         }
//     };


//     const getPageNumbers = () => {
//         const pages = [];
//         const showAmount = 5;

//         const middle = Math.floor(showAmount / 2); // = 2

//         let startPage = page - middle;
//         let endPage = page + middle;

//         // ป้องกันหลุดขอบซ้าย
//         if (startPage < 1) {
//             startPage = 1;
//             endPage = showAmount;
//         }

//         // ป้องกันหลุดขอบขวา
//         if (endPage > totalPage) {
//             endPage = totalPage;
//             startPage = Math.max(1, totalPage - showAmount + 1);
//         }

//         for (let i = startPage; i <= endPage; i++) {
//             pages.push(i);
//         }

//         return pages;
//     };

//     return {
//         data,
//         limit,
//         page,
//         totalPage,
//         search,
//         startDate,
//         endDate,
//         loading,
//         handleSearch,
//         handleDateChange,
//         handlePageChange,
//         fetchData,
//         getPageNumbers,
//     };
// };

// export default useServerFilterPagination;

// import { useState, useEffect, useCallback } from "react";

// const useServerFilterPagination = ({
//     apiCall,
//     limit = 10,
//     enabled = true,
//     status,
// }) => {
//     // ===============================
//     // State
//     // ===============================
//     const [data, setData] = useState([]);
//     const [page, setPage] = useState(1);
//     const [totalPage, setTotalPage] = useState(1);
//     const [totalCount, setTotalCount] = useState(0);
//     const [search, setSearch] = useState("");
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // ===============================
//     // Fetch
//     // ===============================
//     const fetchData = useCallback(async () => {
//         if (enabled !== true) return;
//         try {
//             setLoading(true);
//             const res = await apiCall({ page, limit, search, startDate, endDate, status });
//             const result = res?.data?.data || {};

//             const fetchedData = result?.data || [];
//             const fetchedTotalPage = Number(result.totalPage) || 1;

//             setData(fetchedData);
//             setTotalPage(fetchedTotalPage);

//             // ຄິດໄລ່ totalCount ຈາກ totalPage × limit + ຂໍ້ມູນໜ້າສຸດທ້າຍ
//             setTotalCount((fetchedTotalPage - 1) * limit + fetchedData.length);
//         } catch (error) {
//             console.error("Fetch error:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [apiCall, page, limit, search, startDate, endDate, enabled, status]);

//     useEffect(() => {
//         fetchData();
//     }, [page, search, startDate, endDate, enabled, status]);

//     // ===============================
//     // Handlers
//     // ===============================
//     const handleSearch = (value) => {
//         setPage(1);
//         setSearch(value);
//     };

//     const handleDateChange = ({ startDate, endDate }) => {
//         setPage(1);
//         setStartDate(startDate);
//         setEndDate(endDate);
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPage) {
//             setPage(newPage);
//         }
//     };

//     const getPageNumbers = () => {
//         const pages = [];
//         const showAmount = 5;
//         const middle = Math.floor(showAmount / 2);

//         let startPage = page - middle;
//         let endPage = page + middle;

//         if (startPage < 1) {
//             startPage = 1;
//             endPage = showAmount;
//         }

//         if (endPage > totalPage) {
//             endPage = totalPage;
//             startPage = Math.max(1, totalPage - showAmount + 1);
//         }

//         for (let i = startPage; i <= endPage; i++) {
//             pages.push(i);
//         }

//         return pages;
//     };

//     // ຄິດໄລ່ range ສຳລັບສະແດງ "1-10 ຈາກ 18 ລາຍການ"
//     const rangeStart = data.length === 0 ? 0 : (page - 1) * limit + 1;
//     const rangeEnd = (page - 1) * limit + data.length;

//     return {
//         data,
//         limit,
//         page,
//         totalPage,
//         totalCount,
//         rangeStart,
//         rangeEnd,
//         search,
//         startDate,
//         endDate,
//         loading,
//         handleSearch,
//         handleDateChange,
//         handlePageChange,
//         fetchData,
//         getPageNumbers,
//     };
// };

// export default useServerFilterPagination;



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
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputPage, setInputPage] = useState("1");

    // ===============================
    // Fetch
    // ===============================
    const fetchData = useCallback(async () => {
        if (enabled !== true) return;
        try {
            setLoading(true);
            const res = await apiCall({ page, limit, search, startDate, endDate, status });
            const result = res?.data?.data || {};


            const fetchedData = result?.data || [];
            const fetchedTotalPage = Number(result.totalPage) || 1;
            const fetchedTotalCount = Number(result.count) || 0; // ✅ ดึงค่า total จริงจาก API


            setData(fetchedData);
            setTotalPage(fetchedTotalPage);
            setTotalCount(fetchedTotalCount);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [apiCall, page, limit, search, startDate, endDate, enabled, status]);

    useEffect(() => {
        fetchData();
    }, [page, search, startDate, endDate, enabled, status]);

    // sync inputPage ເມື່ອ page ປ່ຽນ (ເຊັ່ນ: ກົດປຸ່ມ ‹ ›)
    useEffect(() => {
        setInputPage(String(page));
    }, [page]);

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

    // ພິມໜ້າ → ໄປທັນທີ
    const handleInputPageChange = (value) => {
        setInputPage(value);
        const parsed = parseInt(value);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPage) {
            setPage(parsed);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const showAmount = 5;
        const middle = Math.floor(showAmount / 2);

        let startPage = page - middle;
        let endPage = page + middle;

        if (startPage < 1) {
            startPage = 1;
            endPage = showAmount;
        }

        if (endPage > totalPage) {
            endPage = totalPage;
            startPage = Math.max(1, totalPage - showAmount + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const rangeStart = data.length === 0 ? 0 : (page - 1) * limit + 1;
    const rangeEnd = (page - 1) * limit + data.length;

    return {
        data,
        limit,
        page,
        totalPage,
        totalCount,
        rangeStart,
        rangeEnd,
        inputPage,
        search,
        startDate,
        endDate,
        loading,
        handleSearch,
        handleDateChange,
        handlePageChange,
        handleInputPageChange,
        fetchData,
        getPageNumbers,
    };
};

export default useServerFilterPagination;