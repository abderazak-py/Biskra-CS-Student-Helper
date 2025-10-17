"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Tag, Clock, Calendar } from "lucide-react";
import type { CourseDetailModel } from "@/model/courseModel";
import {courseService} from "@/service/api/course/courseService";
import Image from "next/image";
import {CourseHeader} from "@/components/courses/ui/CourseHeader";

// --------------------
// ✅ Fetch function
// --------------------
const fetchCourse = async (id: string): Promise<CourseDetailModel> => {
    const res = await fetch(`http://localhost:8080/api/courses/${id}`);
    if (!res.ok) throw new Error("Failed to fetch course");
    return res.json();
};

// --------------------
// ✅ Component
// --------------------
export default function CourseDetailPage({ id }: { id: string }) {
    const { data: course, isLoading, isError } = useQuery({
        queryKey: ["course", id],
        queryFn: () => courseService.getCourseByID(id),
    });

    if (isLoading) return <p className="p-8 text-gray-500">Loading course...</p>;
    if (isError || !course) return <p className="p-8 text-red-500">Error loading course.</p>;

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const formatTime = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;
    document.title = course.title;
    return (
        <div className="h-screen flex flex-col">
            {/* Fixed Header */}
            <div className="shrink-0">
                <CourseHeader course={course} />
            </div>

            {/* Scrollable Section */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-6 p-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">{course.title}</h1>
                        <p className="text-slate-600 mt-2">{course.description}</p>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-full max-h-80 overflow-hidden rounded-lg border bg-slate-100">
                        {course.thumbnailUrl ? (
                            <img
                                src={
                                    course.thumbnailUrl.startsWith("http")
                                        ? course.thumbnailUrl
                                        : `http://localhost:9000/${course.thumbnailUrl}`
                                }
                                alt="Thumbnail"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-60 text-gray-400">
                                No thumbnail available
                            </div>
                        )}
                    </div>

                    {/* Info card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Estimated Time: {formatTime(course.estimatedTime)}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Due: {formatDate(course.dueDate)}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <Separator />
                            {/* Groups */}
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Groups
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {course.groups?.length > 0 ? (
                                        course.groups.map((g) => <Badge key={g.id}>{g.groupName}</Badge>)
                                    ) : (
                                        <p className="text-sm text-gray-500">No groups</p>
                                    )}
                                </div>
                            </div>

                            {/* Factors */}
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Factors
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {course.factors?.length > 0 ? (
                                        course.factors.map((f) => <Badge key={f.id}>{f.factorName}</Badge>)
                                    ) : (
                                        <p className="text-sm text-gray-500">No factors</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lessons */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> Lessons
                        </h2>
                        {course.lessons.length > 0 ? (
                            course.lessons.map((lesson, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <CardTitle>Lesson {lesson.order}</CardTitle>
                                        <CardDescription>{lesson.time}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <img
                                            src={lesson.imageUrl}
                                            alt={`Lesson ${i}`}
                                            className="w-full h-48 object-cover rounded-md border"
                                        />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No lessons available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
    ;
}
