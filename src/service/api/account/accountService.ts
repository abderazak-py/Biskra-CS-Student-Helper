



import {axiosClient} from "@/api/apiClient";

import {CourseDetailModel, CourseModel} from "@/model/courseModel";
import {AccountModel} from "@/model/accountModel";


export const accountService = {

    getAllAccounts: async () => {
        try {
            const response = await axiosClient.get<AccountModel[]>(`/accounts/`);
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for courses:', error);
            throw error;
        }
    },
    createAccount: async (data:AccountModel) => {
        try {
            const response = await axiosClient.post<AccountModel[]>(`/accounts/`,data);
            console.log(response);

            return response.data;
        } catch (error) {
            console.log('Error searching for courses:', error);
            throw error;
        }
    },

}