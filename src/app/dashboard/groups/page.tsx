import GroupsPage from "@/page/dashboard/GroupsPage";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Groups",
    description: "LMS Groups",
};

export default function Groups(){
    return (
        <div>
            <GroupsPage />
        </div>
    )
}