import CoursePage from "@/page/dashboard/CoursePage";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: "Courses",
    description: "LMS Courses",
};


export default function Courses(){
    return (
        <div>
            <CoursePage />
        </div>
    )
}