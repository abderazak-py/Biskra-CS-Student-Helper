import React from "react";
import type { Metadata } from "next";
import LearnerDetailPage from "@/page/dashboard/LearnerDetailPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);

    return <LearnerDetailPage params={{ id }} />;
}


