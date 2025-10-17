import {Button} from "@heroui/button";
import {OverviewPage} from "@/page/dashboard/OverviewPage";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: "Overview",
    description: "LMS Courses",
};

export default function Dashboard(){
    return(
        <div>
            <OverviewPage />
        </div>
    )
}

