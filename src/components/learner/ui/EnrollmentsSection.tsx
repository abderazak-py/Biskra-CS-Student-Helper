"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { CourseCard } from "./CourseCard";

export const EnrollmentsSection = ({ enrollments }: { enrollments: any[] }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Enrollments
            </CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-scroll h-[600px]">
            {enrollments?.length ? (
                <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                        <CourseCard key={enrollment.id} enrollment={enrollment} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No enrollments found</p>
                </div>
            )}
        </CardContent>
    </Card>
);
