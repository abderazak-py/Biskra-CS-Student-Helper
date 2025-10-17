"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const CourseCard = ({ enrollment }: { enrollment: any }) => (
    <Card>
        <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row gap-4 p-4">
                <img
                    src={enrollment.courseTracking?.courseThumbnail}
                    alt={enrollment.courseTracking?.courseName || "Course"}
                    className="w-full sm:w-32 h-32 rounded-md object-cover"
                />
                <div className="flex-1 space-y-3">
                    <h3 className="font-semibold text-lg">{enrollment.courseTracking?.courseName}</h3>
                    <Badge variant={enrollment.courseTracking?.completed ? "default" : "secondary"} className="gap-1">
                        {enrollment.courseTracking?.completed ? <Award className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {enrollment.courseTracking?.completed ? "Completed" : "In Progress"}
                    </Badge>
                    <div>
                        <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{enrollment.courseTracking?.score || 0}%</span>
                        </div>
                        <Progress value={enrollment.courseTracking?.score || 0} className="h-2" />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);
