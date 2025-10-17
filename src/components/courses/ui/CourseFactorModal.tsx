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
import { factorService } from "@/service/api/factor/factorService";
import { courseService } from "@/service/api/course/courseService";
import { FactorModel } from "@/model/factorModel";
import { CourseDetailModel } from "@/model/courseModel";
import { useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type CourseFactorModalProps = {
    open: boolean;
    onClose: () => void;
    course: CourseDetailModel;
};

export default function CourseFactorModal({ open, onClose, course }: CourseFactorModalProps) {
    const queryClient = useQueryClient();
    const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

    const { data: factors = [], isLoading, isError } = useQuery<FactorModel[]>({
        queryKey: ["factors"],
        queryFn: factorService.getAllFactor,
        enabled: open,
    });

    // ✅ Add factors
    const updateFactorsMutation = useMutation({
        mutationFn: (factorIds: string[]) => courseService.updateFactors(course.id, factorIds),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["course", course.id]}).then(r =>r);
            setSelectedFactors([]);
            onClose();
        },
    });

    // ✅ Delete factor
    const deleteFactorMutation = useMutation({
        mutationFn: (factorId: string) => courseService.deleteFactors(course.id, factorId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["course", course.id] }),
    });

    const assignedFactors = course.factors?.map((f) => f.id) ?? [];
    const availableFactors = factors.filter((f) => !assignedFactors.includes(f.id));

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit Factors for {course.title}</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {isLoading && <p>Loading factors...</p>}
                    {isError && <p className="text-red-500">Failed to load factors</p>}

                    {/* --- Current factors --- */}
                    <div>
                        <span className="font-medium">Current Factors:</span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {course.factors && course.factors.length > 0 ? (
                                course.factors.map((f) => (
                                    <Badge
                                        key={f.id}
                                        className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white"
                                    >
                                        {f.factorName}
                                        <X
                                            className="w-4 h-4 cursor-pointer hover:text-red-500"
                                            onClick={() => deleteFactorMutation.mutate(f.id)}
                                        />
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-gray-400">No factors yet</span>
                            )}
                        </div>
                    </div>

                    {/* --- Add new factors --- */}
                    <div>
                        <span className="font-medium">Add New Factors:</span>
                        <MultiSelect
                            options={availableFactors.map((f) => ({
                                label: f.name,
                                value: f.id,
                            }))}
                            value={selectedFactors}
                            onValueChange={setSelectedFactors}
                            placeholder="Select factors to add"
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        disabled={selectedFactors.length === 0 || updateFactorsMutation.isPending}
                        onClick={() => updateFactorsMutation.mutate(selectedFactors)}
                    >
                        {updateFactorsMutation.isPending ? "Saving..." : "Add Factors"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
