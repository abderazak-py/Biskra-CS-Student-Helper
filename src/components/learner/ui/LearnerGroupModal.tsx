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
import { learnerService } from "@/service/api/learner/learnerService";
import { groupService } from "@/service/api/group/groupService";
import { GroupModel } from "@/model/groupModel";
import {LearnerAdminResponseDto, LearnerModel, LearnerResponseDto} from "@/model/learnerModel";
import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type LearnerGroupModalProps = {
    open: boolean;
    onClose: () => void;
    learner: LearnerResponseDto;
};

export default function LearnerGroupModal({ open, onClose, learner }: LearnerGroupModalProps) {
    const queryClient = useQueryClient();
    const [selectedGroup, setSelectedGroup] = useState<string>("");



    // Fetch all groups
    const { data: groups = [], isLoading: groupsLoading } = useQuery<GroupModel[]>({
        queryKey: ["groups"],
        queryFn: groupService.getAllGroups,
        enabled: open,
    });

    useEffect(() => {
        if (learner?.groupID) setSelectedGroup(learner.groupID);
        groups.filter((group)=>group.id === selectedGroup);
    }, [learner,open]);

    const updateGroupMutation = useMutation({
        mutationFn: (groupId: string) => learnerService.updateGroupLearner(learner.id, groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["learner", learner.id] });
            onClose();
        },
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>
                        { `Edit Group for ${learner.firstName} ${learner.lastName}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">

                    <>
                        <p className="text-sm text-gray-600">
                            Current group:{" "}
                            <span className="font-medium">
                                    {learner?.groupName || "None"}
                                </span>
                        </p>

                        <div>
                            <span className="font-medium">Select New Group:</span>
                            <Select
                                onValueChange={setSelectedGroup}
                                value={selectedGroup}
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Choose group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((g) => (
                                        <SelectItem key={g.id} value={g.id}>
                                            {g.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </>

                </div>

                <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={
                            !selectedGroup ||
                            updateGroupMutation.isPending ||
                            selectedGroup === learner?.groupID
                        }
                        onClick={() => updateGroupMutation.mutate(selectedGroup)}
                    >
                        {updateGroupMutation.isPending ? "Updating..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
