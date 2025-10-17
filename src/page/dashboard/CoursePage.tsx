"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { courseColumn } from "@/components/courses/table/columns";
import CourseTable from "@/components/courses/table/course-table";
import CourseModal from "@/components/courses/modal/courseModal";
import { courseService } from "@/service/api/course/courseService";
import {CourseDetailModel, CourseModel} from "@/model/courseModel";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
type Course = {
    id: string;
    title: string;
    description: string;
};

export default function CoursePage() {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const router = useRouter();

    const { data: courses = [], isLoading, isError } = useQuery<CourseDetailModel[]>({
        queryKey: ["courses"],
        queryFn: courseService.getAllCourses,
    });

    const coursesOrNull = courses ?? []
    const allGroups: string[] = Array.from(
        new Set(
            coursesOrNull.flatMap((c) =>
                c.groups?.map((g) => g.groupName) || []
            )
        )
    );

    const filteredCourses = courses?.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesGroups =
            selectedGroups.length === 0 ||
            course.groups?.some((g) =>
                selectedGroups.includes(g.groupName)
            );

        return matchesSearch && matchesGroups;
    });

    const toggleGroup = (group: string) => {
        setSelectedGroups((prev) =>
            prev.includes(group)
                ? prev.filter((g) => g !== group)
                : [...prev, group]
        );
    };

    return (
        <div>
            <div className="headline-medium-em mb-2">Courses</div>

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Courses</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between">
                {/* Search input */}
                <div className="flex items-center gap-2 mt-6" >
                    <input
                        type="text"
                        placeholder="Search by course name..."
                        className="border rounded px-3 body-medium py-1 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Group filter dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Filter by Group {selectedGroups.length > 0 && `(${selectedGroups.length})`}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            {allGroups.map((group) => (
                                <DropdownMenuCheckboxItem
                                    key={group}
                                    checked={selectedGroups.includes(group)}
                                    onCheckedChange={() => toggleGroup(group)}
                                    onSelect={(e) => e.preventDefault()} // ✅ keep menu open
                                >
                                    {group}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedGroups([]);
                        }}
                    >
                        Clear All Filters
                    </Button>
                </div>
                <div>
                    <Button
                        onClick={()=>{
                            router.push("/dashboard/courses/create",{

                            })
                        }

                        }
                    >
                        + Create Course
                    </Button>
                </div>
            </div>


            {/* Table */}
            <div className="mt-4">
                {isLoading && <p>Loading courses...</p>}
                {isError && <p className="text-red-500">Failed to load courses</p>}
                {!isLoading && !isError && (
                    <CourseTable
                        columns={courseColumn()}
                        data={filteredCourses || []}
                        onCourseClick={(course) => {
                            router.push(`/dashboard/courses/${course.id}`);
                        }}
                    />
                )}
            </div>

            {/* Modal */}
            <CourseModal
                open={open}
                onClose={() => setOpen(false)}
                courseId={selectedCourse?.id || ""}
            />
        </div>
    );
}
