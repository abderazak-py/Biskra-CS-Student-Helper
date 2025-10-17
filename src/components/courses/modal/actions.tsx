
"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogFooter } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { CourseDetailModel } from "@/model/courseModel";

type CourseActionsProps = {
    course: CourseDetailModel | null;
    onClose: () => void;
};

export default function CourseActions({ course, onClose }: CourseActionsProps) {
    if (!course) return null;

    const secondaryActions = [
        { label: "Duplicate", onClick: () => console.log("Duplicate", course.id) },
        { label: "Share", onClick: () => console.log("Share", course.id) },
        { label: "Export PDF", onClick: () => console.log("Export PDF", course.id) },
    ];

    return (
        <DialogFooter className="flex items-center justify-between">
            {/* Left side: Primary buttons */}
            <div className="flex gap-2 flex-wrap">

                {/* Dropdown for secondary actions */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {secondaryActions.map((action) => (
                            <DropdownMenuItem key={action.label} onClick={action.onClick}>
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Button variant="outline" onClick={onClose}>
                Close
            </Button>
        </DialogFooter>
    );
}
