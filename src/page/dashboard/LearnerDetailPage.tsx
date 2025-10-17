"use client";

import { useQuery } from "@tanstack/react-query";
import { learnerService } from "@/service/api/learner/learnerService";
import type { LearnerAdminResponseDto } from "@/model/learnerModel";
import { LoadingState } from "@/components/learner/ui/LoadingState";
import { ErrorState } from "@/components/learner/ui/ErrorState";
import { ProfileHeader } from "@/components/learner/ui/ProfileHeader";
import { ProfileInfo } from "@/components/learner/ui/ProfileInfo";
import { EnrollmentsSection } from "@/components/learner/ui/EnrollmentsSection";
import { StatisticsCard } from "@/components/learner/ui/StatisticsCard";

const calculateStats = (enrollments: any[]) => {
    const safe = enrollments || [];
    const completed = safe.filter((e) => e.courseTracking?.completed).length;
    const avg = safe.length
        ? Math.round(
            safe.reduce((a, e) => a + (e.courseTracking?.score || 0), 0) /
            safe.length
        )
        : 0;
    return {
        total: safe.length,
        completed,
        inProgress: safe.length - completed,
        avgScore: avg,
    };
};

export default function LearnerDetailPage({
                                              params,
                                          }: {
    params: { id: string };
}) {
    const {
        data: learnerData,
        isLoading,
        isError,
        error,
    } = useQuery<LearnerAdminResponseDto>({
        queryKey: ["learner", params.id],
        queryFn: () => learnerService.getLearnerByID(params.id),
        enabled: !!params.id,
    });

    // ✅ Derived loading / error states
    if (isLoading) return <LoadingState />;
    if (isError || !learnerData?.learner)
        return <ErrorState error={error?.message || "Failed to load learner"} />;

    const { learner: l, enrollments } = learnerData;
    const stats = calculateStats(enrollments);

    // ✅ Optional: set document title
    if (typeof window !== "undefined") {
        document.title = `${l.firstName} ${l.lastName}` || "Learner Profile";
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <ProfileHeader
                learner={l}
                onEditFactors={() => console.log("Edit factors")}
                onEditGroup={() => console.log("Edit group")}
            />

            <div className="py-6">
                <div className="flex gap-2">
                    <div className="flex basis-1/3">
                        <div className="w-full flex flex-col gap-3">
                            <ProfileInfo learner={l} />
                            <StatisticsCard stats={stats} />
                        </div>
                    </div>

                    <div className="w-full">
                        <EnrollmentsSection enrollments={enrollments} />
                    </div>
                </div>
            </div>
        </div>
    );
}
