
import {Metadata} from "next";
import LoginForm from "@/components/auth/login/loginForm"; // your typed API

export const metadata: Metadata = {
    title: "Login",
    description: "LMS Groups",
};
export default function LoginAuth() {
return (
    <div>
        <LoginForm />
    </div>
)
}