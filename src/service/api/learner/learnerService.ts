import {axiosClient} from "@/api/apiClient";
import {LearnerAdminResponseDto, LearnerModel, LearnerRequestDto} from "@/model/learnerModel";


export const learnerService = {

    getAllLearner: async () => {
        try {
            const response = await axiosClient.get<LearnerModel[]>(`/learners/`);
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error searching for learner:', error);
            throw error;
        }
    },
    getLearnerByID: async (id:string) => {
        try {
            const response = await axiosClient.get<LearnerAdminResponseDto>(`/learners/${id}/admin`);
            console.log(response);
            return await response.data;
        } catch (error) {
            console.error('Error searching for learner:', error);
            throw error;
        }
    },
    createLearner: async (data: LearnerRequestDto) => {
        try {
            const response = await axiosClient.post("/learners/", data);
            return response.data;
        } catch (error: any) {
            if (error.error) {
                throw new Error(error.error);
            }

            // fallback
            throw new Error("Failed to create learner. Please try again.");
        }
    },
    updateGroupLearner: async (id:string,groupId:string) => {
        try {
            const response = await axiosClient.put(`/learners/${id}/group`,{
                groupId : groupId
            });
            return response.data;
        } catch (error: any) {
            if (error.error) {
                throw new Error(error.error);
            }

            // fallback
            throw new Error("Failed to create learner. Please try again.");
        }
    },

    addLearnerFactors: async (id:string,factors:string[]) => {
        try {
            const response = await axiosClient.put(`/learners/${id}/factors`,{
                factors : factors
            });
            return response.data;
        } catch (error: any) {
            if (error.error) {
                throw new Error(error.error);
            }

            // fallback
            throw new Error("Failed to create learner. Please try again.");
        }
    },
    deleteLearnerFactor: async (id:string,factorID:string) => {
        try {
            const response = await axiosClient.delete(`/learners/${id}/factor/${factorID}`);
            return response.data;
        } catch (error: any) {
            if (error.error) {
                throw new Error(error.error);
            }

            // fallback
            throw new Error("Failed to create learner. Please try again.");
        }
    },

}