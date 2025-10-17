import {axiosClient} from "@/api/apiClient";
import {GroupModel, GroupRequestModel} from "@/model/groupModel";


export const groupService = {

    getAllGroups : async() =>{
        try {
            const response = await axiosClient.get<GroupModel[]>(`/groups/`);
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for person:', error);
            throw  error;
        }
    },
    createGroup : async(data:GroupRequestModel) => {
        try {
            const response = await axiosClient.post(`/groups/`, data);
            console.log(response);

            return await response.data;
        } catch (error) {
            console.error('Error searching for person:', error);
            throw  error;
        }
    }
}