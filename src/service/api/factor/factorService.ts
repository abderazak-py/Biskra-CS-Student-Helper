import {axiosClient} from "@/api/apiClient";
import {GroupModel, GroupRequestModel} from "@/model/groupModel";
import {FactorModel, FactorRequestModel} from "@/model/factorModel";


export const factorService = {

    getAllFactor : async() =>{
        try {
            const response = await axiosClient.get<FactorModel[]>(`/factors/`);
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for factor:', error);
            throw  error;
        }
    },
    createFactor : async(data:FactorRequestModel) => {
        try {
            const response = await axiosClient.post(`/factors/`, data);
            console.log(response);

            return await response.data;
        } catch (error) {
            console.error('Error searching for factor:', error);
            throw  error;
        }
    }
}