import {AuthenticationResponse, AuthenticationRequest, UserRole} from "@/model/authModel";
import axios, {AxiosError} from "axios";

export const LoginAPI = {
    login: async ({email, password}: AuthenticationRequest): Promise<AuthenticationResponse> => {
        const {data} = await axios.post<AuthenticationResponse>(
            "http://72.62.232.43:6060/api/v1/auth/login",
            {email, password},
            {headers: {"Content-Type": "application/json"}}
        ).catch((error: AxiosError<{error?: string}>) => {
            console.log(error);
            const message = error.response?.data?.error || error.message || "Login failed";
            throw new Error(message);
        });

        if (data.role !== UserRole.admin) {
            throw new Error("Not authorized");
        }

        return data;
    },
};