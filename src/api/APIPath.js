export default class APIPath {
    static BASE_URL = import.meta.env.VITE_API_URL;

    // Auth / User API
    static REGISTER = `${this.BASE_URL}/user/register`;
    static LOGIN = `${this.BASE_URL}/user/login`;
    static LOGIN_ADMIN = `${this.BASE_URL}/user/loginAdmin`;
    static INSERT_ADMIN = `${this.BASE_URL}/user/registerAdmin`; //add new
    static SELECT_ALL_USER = `${this.BASE_URL}/user/selAll`;
    static SELECT_ONE_USER(id) { return `${this.BASE_URL}/user/selOne/${id}`}
    static SEARCH = `${this.BASE_URL}/user/search`;
    static GET_PROFILE = `${this.BASE_URL}/user/profile`;
    static FORGOT = `${this.BASE_URL}/user/forgot`;
    static CHANGE_PASSWORD = `${this.BASE_URL}/user/changePassword`;
    static REFRESH = `${this.BASE_URL}/user/refresh`;
    static UPDATE_PROFILE = `${this.BASE_URL}/user/update`;
    static UPDATE_CUSTOMER(id) { return `${this.BASE_URL}/user/update/${id}`};
    static UPDATE_POINT = `${this.BASE_URL}/user/updatePoint`; // add new
    static DELETE_USER= `${this.BASE_URL}/user/delete`;
    static DELETE_CUSTOMER(id) { return `${this.BASE_URL}/user/delete/${id}`};



    // Gift Card API
    static SELECT_ALL_GIFT = `${this.BASE_URL}/giftcard/selAll`;
    static SELECT_ONE_GIFT(id) { return `${this.BASE_URL}/giftcard/selOne/${id}` }
    static CREATE_GIFT= `${this.BASE_URL}/giftcard/insert`
    static UPDATE_GIFT(id) { return `${this.BASE_URL}/giftcard/update/${id}` }
    static UPDATE_GIFT_STATUS(id) { return `${this.BASE_URL}/giftcard/updateStatus/${id}` }
    static DELETE_GIFT(id) { return `${this.BASE_URL}/giftcard/delete/${id}` }

    // Gift History API
    static SELECT_ALL_GIFT_HISTORY = `${this.BASE_URL}/gifthistory/selAll`;
    static SELECT_ONE_GIFT_HISTORY(id) { return `${this.BASE_URL}/gifthistory/selOne/${id}` }
    static CREATE_GIFT_HISTORY = `${this.BASE_URL}/gifthistory/insert`;
    static UPDATE_GIFT_HISTORY(id) { return `${this.BASE_URL}/gifthistory/update/${id}` }
    static DELETE_GIFT_HISTORY(id) { return `${this.BASE_URL}/gifthistory/delete/${id}` }
    // Fix API
    static SELECT_ALL_FIX = `${this.BASE_URL}/fix/selAll`;
    static SEARCH_FIX = `${this.BASE_URL}/fix/search`;
    static SELECT_ONE_FIX(id) { return `${this.BASE_URL}/fix/selOne/${id}` }
    static SELECT_FIX_BY_STATUS = `${this.BASE_URL}/fix/selByStatus`;
    static CREATE_FIX = `${this.BASE_URL}/fix/insert`;
    static UPDATE_FIX(id) { return `${this.BASE_URL}/fix/update/${id}` }
    static UPDATE_FIX_STATUS(id) { return `${this.BASE_URL}/fix/updateStatus/${id}` }
    static DELETE_FIX(id) { return `${this.BASE_URL}/fix/delete/${id}` }

    // Promotion API
    static SELECT_ALL_PROMOTION = `${this.BASE_URL}/promotion/selAll`;
    static SELECT_ONE_PROMOTION(id) { return `${this.BASE_URL}/promotion/selOne/${id}` }
    static CREATE_PROMOTION = `${this.BASE_URL}/promotion/insert`;
    static UPDATE_PROMOTION(id) { return `${this.BASE_URL}/promotion/update/${id}` }
    static DELETE_PROMOTION(id) { return `${this.BASE_URL}/promotion/delete/${id}` }


    // Booking API
    static SELECT_ALL_BOOKING = `${this.BASE_URL}/booking/selAll`;
    static SEARCH_BOOKING = `${this.BASE_URL}/booking/search`;
    static SELECT_ONE_BOOKING(booking_id) { return `${this.BASE_URL}/booking/selOne/${booking_id}`}
    static SELECT_BY_USER = `${this.BASE_URL}/booking/selByUser`;
    static SELECT_BOOKING_BY_STATUS = `${this.BASE_URL}/booking/selByStatus`;
    static SELECT_BOOKING_BY_BRANCH(branch_id) { return `${this.BASE_URL}/booking/selByBranch/${branch_id}` };
    static CREATE_BOOKING = `${this.BASE_URL}/booking/insert`;
    static UPDATE_BOOKING(id) { return `${this.BASE_URL}/booking/update/${id}`}
    static UPDATE_BOOKING_STATUS(id) { return `${this.BASE_URL}/booking/updateStatus/${id}`}
    static DELETE_BOOKING(id) { return `${this.BASE_URL}/booking/delete/${id}`}

    // Booking Detail API
    static CREATE_BOOKING_DETAIL = `${this.BASE_URL}/bookingDetail/insert`
    static SELECT_BOOKING_DETAIL_BY(bookingId) { return `${this.BASE_URL}/bookingDetail/selBy/${bookingId}` }



    // Car API
    static SELECT_ALL_CAR = `${this.BASE_URL}/car/selAll`;
    static SEARCH_CAR = `${this.BASE_URL}/car/search`;
    static SELECT_ONE_CAR(id) { return `${this.BASE_URL}/car/selOne/${id}`}
    static SELECT_CAR_BY(id) { return `${this.BASE_URL}/car/selBy/${id}`}
    static CREATE_CAR = `${this.BASE_URL}/car/insert`;
    static UPDATE_CAR(id) { return `${this.BASE_URL}/car/update/${id}`}
    static DELETE_CAR(id) { return `${this.BASE_URL}/car/delete/${id}`}


    // Service API
    static SELECT_ALL_SERVICE = `${this.BASE_URL}/service/selAll`;
    static SELECT_ONE_SERVICE(id) { return `${this.BASE_URL}/service/selOne/${id}`}
    static CREATE_SERVICE = `${this.BASE_URL}/service/insert`;
    static UPDATE_SERVICE(id) { return `${this.BASE_URL}/service/update/${id}`}
    static DELETE_SERVICE(id) { return `${this.BASE_URL}/service/delete/${id}`}


    // Time API
    static SELECT_ALL_TIME = `${this.BASE_URL}/time/selAll`;
    static SEARCH_TIME = `${this.BASE_URL}/time/search`;
    static SELECT_ONE_TIME(id) { return `${this.BASE_URL}/time/selOne/${id}`}
    static SELECT_TIME_BY_BRANCH(id) { return `${this.BASE_URL}/time/selBy/:branchId/${id}`}
    static CREATE_TIME = `${this.BASE_URL}/time/insert`;
    static UPDATE_TIME(id) { return `${this.BASE_URL}/time/update/${id}`}
    static UPDATE_TIME_STATUS(id) { return `${this.BASE_URL}/time/updateStatus/${id}`}
    static DELETE_TIME(id) { return `${this.BASE_URL}/time/delete/${id}`}




    // Zone API
    static SELECT_ALL_ZONE = `${this.BASE_URL}/zone/selAll`;
    static SEARCH_ZONE = `${this.BASE_URL}/zone/search`;
    static SELECT_ONE_ZONE(id) { return `${this.BASE_URL}/zone/selOne/${id}`}
    static SELECT_ZONE_BY(id) { return `${this.BASE_URL}/zone/selBy/${id}`}
    static CREATE_ZONE = `${this.BASE_URL}/zone/insert`;
    static UPDATE_ZONE(id) { return `${this.BASE_URL}/zone/update/${id}`}
    static UPDATE_ZONE_STATUS(id) { return `${this.BASE_URL}/zone/updateStatus/${id}`}
    static DELETE_ZONE(id) { return `${this.BASE_URL}/zone/delete/${id}`}


    // Branch API
    static SELECT_ALL_BRANCH = `${this.BASE_URL}/branch/selAll`
    static SELECT_ONE_BRANCH(id) { return `${this.BASE_URL}/branch/selOne/${id}`}
    static CREATE_BRANCH = `${this.BASE_URL}/branch/insert`
    static UPDATE_BRANCH(id) { return `${this.BASE_URL}/branch/update/${id}`}
    static DELETE_BRANCH(id) { return `${this.BASE_URL}/branch/delete/${id}`}



    // Employee API
    static SELECT_ALL_EMPLOYEE = `${this.BASE_URL}/employee/selAll`
    static SELECT_ONE_EMPLOYEE(id) { return `${this.BASE_URL}/employee/selOne/${id}`}
    static CREATE_EMPLOYEE = `${this.BASE_URL}/employee/insert`
    static UPDATE_EMPLOYEE(id) { return `${this.BASE_URL}/employee/update/${id}`}
    static DELETE_EMPLOYEE(id) { return `${this.BASE_URL}/employee/delete/${id}`}



    

}
