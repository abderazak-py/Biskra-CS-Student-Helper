import AccountPage from "@/page/dashboard/AccountPage";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Accounts",
    description: "LMS Accounts",
};
export default function Accounts() {
    return (
        <div>
            <AccountPage />
        </div>
    )
}