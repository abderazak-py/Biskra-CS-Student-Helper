"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    AreaChart,
    Area, ComposedChart,
} from "recharts";
import { axiosClient } from "@/api/apiClient";
import { CourseEnrollmentStatResponse } from "@/model/courseModel";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ef4444", "#14b8a6"];

async function fetchCourseStats(): Promise<CourseEnrollmentStatResponse[]> {
    const res = await axiosClient.get<CourseEnrollmentStatResponse[]>("/courses/stats/enrollment");
    return res.data;
}

export function OverviewPage() {
    const {
        data: stats = [],
        isLoading,
        isError,
    } = useQuery<CourseEnrollmentStatResponse[]>({
        queryKey: ["courseStats"],
        queryFn: fetchCourseStats,
    });

    if (isLoading) return <div className="p-6">Loading charts...</div>;
    if (isError) return <div className="p-6 text-red-500">Failed to load statistics.</div>;

    const barData = stats.map((c) => ({name: c.title, ratio: c.enrollmentRatio}));
    const pieData = stats.map((c) => ({name: c.title, value: c.enrolledLearners}));
    const lineData = stats.map((c) => ({
        name: c.title,
        enrolled: c.enrolledLearners,
        date: new Date(c.createdAt).toLocaleDateString(),
    }));
    const radarData = stats.map((c) => ({
        course: c.title,
        groups: c.assignedGroupCount,
        factors: c.assignedFactorCount,
    }));
    const areaData = stats.map((c) => ({
        name: c.title,
        potential: c.potentialLearners,
        enrolled: c.enrolledLearners,
    }));

    return (
        <div className="flex flex-col h-full">
            <div className="headline-medium-em mb-2">Overview</div>

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Overview</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Course Statistics</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 🧭 Scrollable Charts Container */}
            <div
                className="mt-6 overflow-y-auto max-h-[85vh] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                    {/* 🟦 Enrollment Ratio Bar Chart */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Course Enrollment Ratio (%)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{top: 20, right: 30, left: 10, bottom: 80}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-45}
                                           textAnchor="end" height={60}/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="ratio" fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 🟩 Enrolled Learners Pie Chart */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Enrolled Learners per Course</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px] flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={120}
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name?.substring(0, 12) ?? ""} (${((Number(percent) ?? 0) * 100).toFixed(1)}%)`
                                        }
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} learners`}/>
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center"
                                            wrapperStyle={{fontSize: 12}}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 🟣 Line Chart */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Enrollment Growth Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={lineData}
                                    margin={{top: 20, right: 30, left: 10, bottom: 20}}
                                >
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="date" tick={{fontSize: 11}}/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>

                                    {/* 🔵 Line: new enrollments */}
                                    <Line
                                        type="monotone"
                                        dataKey="enrolled"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{r: 4}}
                                        name="New Enrollments"
                                    />

                                    {/* 🟢 Area: cumulative enrollments */}
                                    <Area
                                        type="monotone"
                                        dataKey="cumulative"
                                        stroke="#22c55e"
                                        fill="rgba(34,197,94,0.3)"
                                        name="Cumulative Enrollments"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 🟠 Radar Chart */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Group vs Factor Assignments</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData}>
                                    <PolarGrid/>
                                    <PolarAngleAxis dataKey="course"/>
                                    <PolarRadiusAxis/>
                                    <Radar name="Groups" dataKey="groups" stroke="#22c55e" fill="#22c55e"
                                           fillOpacity={0.6}/>
                                    <Radar name="Factors" dataKey="factors" stroke="#f97316" fill="#f97316"
                                           fillOpacity={0.6}/>
                                    <Legend/>
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 🔵 Area Chart */}
                    <Card className="shadow-md md:col-span-2">
                        <CardHeader>
                            <CardTitle>Potential vs Enrolled Learners</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={areaData} margin={{top: 20, right: 30, left: 10, bottom: 10}}>
                                    <defs>
                                        <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorPotential" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Area type="monotone" dataKey="enrolled" stroke="#3b82f6"
                                          fill="url(#colorEnrolled)"/>
                                    <Area type="monotone" dataKey="potential" stroke="#22c55e"
                                          fill="url(#colorPotential)"/>
                                    <Legend/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
