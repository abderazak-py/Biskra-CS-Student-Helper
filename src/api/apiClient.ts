import axios, { AxiosError, AxiosResponse } from "axios";


const axiosClient = axios.create({
    baseURL: "http://72.62.232.43:6060/api/v1/",
    timeout: 5000,
});

// Request interceptor to add token
// axiosClient.interceptors.request.use(
//     (config) => {
//         try {
//             const cookieEncrypted = getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
//             if (!cookieEncrypted) {
//                 removeCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
//                 window.location.href = '/login';
//                 return config;
//             }
//
//             const cookie = decrypt(cookieEncrypted);
//             const user: TUserStoreState = JSON.parse(cookie).state;
//             const token = user.token;
//
//             if (token) {
//                 config.headers = config.headers ?? {};
//                 config.headers.Authorization = `Bearer ${token}`;
//             } else {
//                 removeCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
//                 window.location.href = '/login';
//             }
//
//             return config;
//         } catch (err) {
//             console.error("Request interceptor error:", err);
//             window.location.href = '/login';
//             return config;
//         }
//     },
//     (error) => {
//         console.error("Request error:", error);
//         return Promise.reject(error);
//     }
// );

// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) return Promise.reject(error.response.data);
//     return Promise.reject({ message: error.message });
//   }
// );
export { axiosClient };
