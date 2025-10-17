import {axiosClient} from "@/api/apiClient";

import {CourseDetailModel, CourseModel} from "@/model/courseModel";


export const courseService = {

    getAllCourses: async () => {
        try {
            const response = await axiosClient.get<CourseDetailModel[]>(`/courses/`);
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for courses:', error);
            throw error;
        }
    },
    getAllCoursesStat: async () => {
        try {
            const response = await axiosClient.get<CourseDetailModel[]>(`/courses/`);
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for courses:', error);
            throw error;
        }
    },
    getCourseByID: async (courseID:string) => {
        try {
            const response = await axiosClient.get<CourseDetailModel>(`/courses/${courseID}`);
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for courses:', error);
            throw error;
        }
    },
    addGroups: async (courseID: string, groupIds: string[]) => {
        const payload = { "multi_groups": groupIds };
        console.log(payload);
        await axiosClient.post(`/courses/${courseID}/groups`, payload);
    },
    updateGroups: async (courseID: string, groupIds: string[]) => {
        try {
            const response = await axiosClient.put<CourseDetailModel>(`/courses/${courseID}/groups`,
                {
                    "multi_groups": groupIds,
                });
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for courses:', error);
            throw error;
        }
    }
    ,
    deleteGroups: async (courseID: string, groupId: string) => {
        try {
            const response = await axiosClient.delete<CourseDetailModel>(`/courses/${courseID}/group/${groupId}`);
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for courses:', error);
            throw error;
        }
    },
    updateFactors: async (courseID: string, factorsIds: string[]) => {
        try {
            const response = await axiosClient.put<CourseDetailModel>(`/courses/${courseID}/factors`,
                {
                    "factorsIDs": factorsIds,
                });
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for courses:', error);
            throw error;
        }
    }
    ,
    deleteFactors: async (courseID: string, factorId: string) => {
        try {
            const response = await axiosClient.delete<CourseDetailModel>(`/courses/${courseID}/factor/${factorId}`);
            console.log(response);

            return response.data;
        } catch (error) {
            console.error('Error searching for courses:', error);
            throw error;
        }
    }
}