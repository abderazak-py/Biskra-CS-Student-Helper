"use client";

import { useState } from "react";
import { CourseDetailModel } from "@/model/courseModel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TagsCard from "@/components/courses/ui/detail/TagsCard";
import CourseHeader from "@/components/courses/ui/detail/CourseHeader";
import ThumbnailCard from "@/components/courses/ui/detail/ThumbnailCard";
import DescriptionCard from "@/components/courses/ui/detail/DescriptionCard";

interface CourseDetailsTabProps {
    initialCourse: CourseDetailModel;
}

export default function CourseDetailsTab({ initialCourse }: CourseDetailsTabProps) {
    const [course, setCourse] = useState({
        ...initialCourse,
        tags: initialCourse.tags || [],
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SECTION */}

                <div className="space-y-6">
                    <CourseHeader  />
                    <ThumbnailCard course={initialCourse}  />
                    <DescriptionCard />

                {/* ✅ Tags */}
                <TagsCard course={course} setCourse={setCourse} />
            </div>

            {/* RIGHT SECTION */}
            <div className="space-y-6">
                {/* Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Course Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>
                            <strong>Estimated Time:</strong> {course.estimatedTime} min
                        </p>
                        <p>
                            <strong>Due Date:</strong>{" "}
                            {new Date(course.dueDate).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                    <CardHeader>
                        <CardTitle>Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <p>
                            <strong>Created:</strong>{" "}
                            {new Date(course.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Updated:</strong>{" "}
                            {new Date(course.updatedAt).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full">Save Changes</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
