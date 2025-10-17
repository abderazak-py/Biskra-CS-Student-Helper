import {Metadata} from "next";
import FactorPage from "@/page/dashboard/FactorPage";

export const metadata: Metadata = {
    title: "Factors",
    description: "LMS Factors",
};

export default function Groups(){
    return (
        <div>
            <FactorPage />
        </div>
    )
}