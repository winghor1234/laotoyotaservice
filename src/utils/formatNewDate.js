const date = new Date();
export const formatNewDate = 
  String(date.getDate()).padStart(2, "0") + "/" +
  String(date.getMonth() + 1).padStart(2, "0") + "/" +
  date.getFullYear();