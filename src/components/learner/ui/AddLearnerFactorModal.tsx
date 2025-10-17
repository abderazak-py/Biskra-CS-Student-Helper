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
import { factorService } from "@/service/api/factor/factorService";
import { FactorModel } from "@/model/factorModel";
import { LearnerResponseDto } from "@/model/learnerModel";
import { useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";

type LearnerFactorsModalProps = {
    open: boolean;
    onClose: () => void;
    learner: LearnerResponseDto;
};

export default function AddLearnerFactorsModal({
                                                   open,
                                                   onClose,
                                                   learner,
                                               }: LearnerFactorsModalProps) {
    const queryClient = useQueryClient();
    const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

    // Fetch all available factors
    const { data: factors = [], isLoading, isError } = useQuery<FactorModel[]>({
        queryKey: ["factors"],
        queryFn: factorService.getAllFactor,
        enabled: open,
    });

    // Mutation to add/update learner factors
    const updateFactorsMutation = useMutation({
        mutationFn: (factorIds: string[]) =>
            learnerService.addLearnerFactors(learner.id, factorIds),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["learner", learner.id]}).then(r =>r);
            setSelectedFactors([]);
            onClose();
        },
    });

    const assignedFactors = learner.factors?.map((f) => f.id) ?? [];
    const availableFactors = factors.filter(
        (f) => !assignedFactors.includes(f.id)
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {`Edit Factors for ${learner.firstName} ${learner.lastName}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {isLoading && <p>Loading factors...</p>}
                    {isError && <p className="text-red-500">Failed to load factors</p>}

                    {/* Existing factors */}
                    <div>
                        <span className="font-medium">Current Factors: </span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {learner.factors && learner.factors.length > 0 ? (
                                learner.factors.map((f) => (
                                    <span
                                        key={f.id}
                                        className="px-2 py-1 text-xs rounded bg-blue-600 text-white"
                                    >
                    {f.factorName}
                  </span>
                                ))
                            ) : (
                                <span className="text-gray-400">No factors yet</span>
                            )}
                        </div>
                    </div>

                    {/* MultiSelect for adding new ones */}
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
                        disabled={
                            selectedFactors.length === 0 || updateFactorsMutation.isPending
                        }
                        onClick={() => updateFactorsMutation.mutate(selectedFactors)}
                    >
                        {updateFactorsMutation.isPending ? "Saving..." : "Add Factors"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
