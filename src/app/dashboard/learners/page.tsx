import {Metadata} from "next";
import LearnerPage from "@/page/dashboard/LearnerPage";



export const metadata: Metadata = {
    title: "Learners",
    description: "LMS Learners",
};


export default function Learner(){
    return (
            <div>
                <LearnerPage />
            </div>

    )
}