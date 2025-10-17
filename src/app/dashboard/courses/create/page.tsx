import {Metadata} from "next";
import CreateCoursePage from "@/page/dashboard/CourseCreatePage";


export const metadata: Metadata = {
    title: "Create Course",
    description: "LMS Groups",
};


export default function CreateCourse(){
    return (
        <div>
            <CreateCoursePage />
        </div>
    )
}