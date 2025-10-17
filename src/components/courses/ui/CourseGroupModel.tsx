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
import { groupService } from "@/service/api/group/groupService";
import { courseService } from "@/service/api/course/courseService";
import { GroupModel } from "@/model/groupModel";
import { CourseDetailModel } from "@/model/courseModel";
import { useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type CourseGroupModalProps = {
    open: boolean;
    onClose: () => void;
    course: CourseDetailModel;
};

export default function CourseGroupModal({ open, onClose, course }: CourseGroupModalProps) {
    const queryClient = useQueryClient();
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

    // ✅ Fetch all groups
    const { data: groups = [], isLoading, isError } = useQuery<GroupModel[]>({
        queryKey: ["groups"],
        queryFn: groupService.getAllGroups,
        enabled: open,
    });

    // ✅ Mutation to add new groups
    const updateGroupsMutation = useMutation({
        mutationFn: (groupIds: string[]) => courseService.updateGroups(course.id, groupIds),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["course", course.id]}).then(r =>r);
            setSelectedGroups([]);
            onClose();
        },
    });

    // ✅ Mutation to delete a group
    const deleteGroupMutation = useMutation({
        mutationFn: (groupId: string) => courseService.deleteGroups(course.id, groupId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["course", course.id] }),
    });

    const assignedGroups = course.groups?.map((g) => g.id) ?? [];
    const availableGroups = groups.filter((g) => !assignedGroups.includes(g.id));

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit Groups for {course.title}</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {isLoading && <p>Loading groups...</p>}
                    {isError && <p className="text-red-500">Failed to load groups</p>}

                    {/* --- Current groups --- */}
                    <div>
                        <span className="font-medium">Current Groups:</span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {course.groups && course.groups.length > 0 ? (
                                course.groups.map((g) => (
                                    <Badge
                                        key={g.id}
                                        className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white"
                                    >
                                        {g.groupName}
                                        <X
                                            className="w-4 h-4 cursor-pointer hover:text-red-500"
                                            onClick={() => deleteGroupMutation.mutate(g.id)}
                                        />
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-gray-400">No groups yet</span>
                            )}
                        </div>
                    </div>

                    {/* --- Add new groups --- */}
                    <div>
                        <span className="font-medium">Add New Groups:</span>
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
                </div>

                <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        disabled={selectedGroups.length === 0 || updateGroupsMutation.isPending}
                        onClick={() => updateGroupsMutation.mutate(selectedGroups)}
                    >
                        {updateGroupsMutation.isPending ? "Saving..." : "Add Groups"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
