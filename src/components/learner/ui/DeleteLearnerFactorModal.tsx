"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { learnerService } from "@/service/api/learner/learnerService";
import { LearnerResponseDto } from "@/model/learnerModel";
import { useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

type LearnerDeleteFactorModalProps = {
    open: boolean;
    onClose: () => void;
    learner: LearnerResponseDto;
};

export default function LearnerDeleteFactorModal({
                                                     open,
                                                     onClose,
                                                     learner,
                                                 }: LearnerDeleteFactorModalProps) {
    const queryClient = useQueryClient();
    const [selectedFactor, setSelectedFactor] = useState<string>("");

    const deleteFactorMutation = useMutation({
        mutationFn: (factorId: string) =>
            learnerService.deleteLearnerFactor(learner.id, factorId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["learner", learner.id] });
            setSelectedFactor("");
            onClose();
        },
    });

    const currentFactors = learner.factors || [];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>
                        {`Remove Factor from ${learner.firstName} ${learner.lastName}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {currentFactors.length > 0 ? (
                        <>
                            <p className="text-sm text-gray-600">
                                Select a factor to remove:
                            </p>

                            <Select
                                onValueChange={setSelectedFactor}
                                value={selectedFactor}
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Choose factor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentFactors.map((f) => (
                                        <SelectItem key={f.id} value={f.id}>
                                            {f.factorName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    ) : (
                        <p className="text-gray-500">This learner has no factors assigned.</p>
                    )}
                </div>

                <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={
                            !selectedFactor ||
                            deleteFactorMutation.isPending ||
                            currentFactors.length === 0
                        }
                        onClick={() => deleteFactorMutation.mutate(selectedFactor)}
                    >
                        {deleteFactorMutation.isPending ? "Removing..." : "Remove Factor"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
