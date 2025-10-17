"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/service/api/course/courseService";
import { groupService } from "@/service/api/group/groupService";
import { CourseDetailModel } from "@/model/courseModel";
import { useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import {GroupModel} from "@/model/groupModel";

type CourseModalProps = {
    open: boolean;
    onClose: () => void;
    courseId?: string;
};

export default function CourseModal({ open, onClose, courseId }: CourseModalProps) {
    const queryClient = useQueryClient();
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

    const { data: course, isLoading, isError } = useQuery<CourseDetailModel | null>({
        queryKey: ["course", courseId],
        queryFn: () => (courseId ? courseService.getCourseByID(courseId) : Promise.resolve(null)),
        enabled: open && !!courseId,
    });

    // Fetch all groups
    const { data: groups = [] } = useQuery<GroupModel[]>({
        queryKey: ["groups"],
        queryFn: groupService.getAllGroups,
        enabled: open,
    });

    // Mutation to add groups
    const addGroupsMutation = useMutation({
        mutationFn: (groupIds: string[]) =>
            courseId ? courseService.addGroups(courseId, groupIds) : Promise.resolve(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            setSelectedGroups([]);
        },
    });

    const assignedGroups = course?.groups ?? [];
    const assignedGroupIds = assignedGroups.map(g => g.id);
    const availableGroups = groups.filter(
        g => !assignedGroupIds.includes(g.id)
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isLoading ? "Loading..." : course?.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {isLoading && <p>Loading course details...</p>}
                    {isError && <p className="text-red-500">Failed to load course details</p>}

                    {course && (
                        <>
                            <p className="text-sm text-gray-600">{course.description}</p>

                            <div>
                                <span className="font-medium">Groups Assigned: </span>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {course.groups.length > 0 ? (
                                        course.groups.map((g) => (
                                            <span
                                                key={g.id}
                                                className="px-2 py-1 text-xs rounded bg-blue-600 text-white"
                                            >
                        {g.groupName}
                      </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">No groups yet</span>
                                    )}
                                </div>
                            </div>

                            {/* MultiSelect for new groups */}
                            <div>
                                <span className="font-medium">Add Groups:</span>
                                <MultiSelect
                                    options={availableGroups.map((g) => ({
                                        label: g.name,
                                        value: g.id,
                                    }))}
                                    value={selectedGroups}
                                    onValueChange={setSelectedGroups}
                                    placeholder="Select groups to add"
                                />
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        disabled={selectedGroups.length === 0 || addGroupsMutation.isPending}
                        onClick={() => addGroupsMutation.mutate(selectedGroups)}
                    >
                        {addGroupsMutation.isPending ? "Adding..." : "Add Groups"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
