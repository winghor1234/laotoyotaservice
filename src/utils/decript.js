// import dotenv from "dotenv";

// dotenv.config();

// import CryptoJS from "crypto-js";

// const SECRET_KEY = process.env.SECRET_KEY;

// // ================= DECRYPT =================

// export const decryptData = (
//     password
// ) => {

//     try {

//         if (!password) {

//             return null;
//         }

//         const bytes =
//             CryptoJS.AES.decrypt(
//                 password,
//                 SECRET_KEY
//             );

//         const decrypted =
//             bytes.toString(
//                 CryptoJS.enc.Utf8
//             );

//         return decrypted || null;

//     } catch (error) {

//         console.log(
//             "Decrypt Error:",
//             error
//         );

//         return null;
//     }
// };