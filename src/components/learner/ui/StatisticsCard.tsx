"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const StatisticsCard = ({ stats }: { stats: any }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-base">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <div className="flex justify-between text-sm"><span>Total Courses</span><span>{stats.total}</span></div>
            <div className="flex justify-between text-sm"><span>Completed</span><span className="text-green-600">{stats.completed}</span></div>
            <div className="flex justify-between text-sm"><span>In Progress</span><span className="text-orange-600">{stats.inProgress}</span></div>
            <div className="flex justify-between text-sm"><span>Average Score</span><span className="text-blue-600">{stats.avgScore}%</span></div>
        </CardContent>
    </Card>
);
