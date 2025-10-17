"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@/service/api/group/groupService";
import { factorService } from "@/service/api/factor/factorService";
import { learnerService } from "@/service/api/learner/learnerService";
import { MultiSelect } from "@/components/ui/multi-select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GroupModel } from "@/model/groupModel";
import { FactorModel } from "@/model/factorModel";
import { LearnerRequestDto } from "@/model/learnerModel";

const learnerSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    groupId: z.string().uuid("Group ID must be valid UUID"),
    factorsIDs: z.array(z.string().uuid("Invalid Factor ID")).optional(),
});

type LearnerFormValues = z.infer<typeof learnerSchema>;

type LearnerModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function LearnerForm({ open, onClose }: LearnerModalProps) {
    const queryClient = useQueryClient();
    const form = useForm<LearnerFormValues>({
        resolver: zodResolver(learnerSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            groupId: "",
            factorsIDs: [],
        },
    });

    const { data: groups = [] } = useQuery<GroupModel[]>({
        queryKey: ["groups"],
        queryFn: groupService.getAllGroups,
        enabled: open,
    });

    const { data: factors = [] } = useQuery<FactorModel[]>({
        queryKey: ["factors"],
        queryFn: () => factorService.getAllFactor(),
        enabled: open,
    });

    const createLearner = useMutation({
        mutationFn: (dto: LearnerFormValues) =>
            learnerService.createLearner(dto as LearnerRequestDto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["learners"] });
            form.reset();
            onClose();
        },
        onError: (error: any) => {
            // Display backend error at the top
            form.setError("root", { type: "server", message: error.message || "Server error" });
        },
    });

    const onSubmit = (values: LearnerFormValues) => {
        createLearner.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Learner</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    {/* Top error box */}
                    {form.formState.errors.root && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                            {form.formState.errors.root.message}
                        </div>
                    )}

                    {/* Field validation errors summary */}
                    {Object.entries(form.formState.errors)
                        .filter(([key]) => key !== "root")
                        .length > 0 && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded">
                            <ul className="list-disc list-inside text-sm">
                                {Object.entries(form.formState.errors)
                                    .filter(([key]) => key !== "root")
                                    .map(([key, error]) => (
                                        <li key={key}>{(error as any).message}</li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            placeholder="Enter email"
                            {...form.register("email")}
                        />
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1 space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium">
                                First Name
                            </label>
                            <Input
                                id="firstName"
                                placeholder="Enter first name"
                                {...form.register("firstName")}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium">
                                Last Name
                            </label>
                            <Input
                                id="lastName"
                                placeholder="Enter last name"
                                {...form.register("lastName")}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            {...form.register("password")}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Group</label>
                        <Select
                            onValueChange={(val) => form.setValue("groupId", val)}
                            value={form.watch("groupId")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Group" />
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Factors</label>
                        <MultiSelect
                            options={factors.map((f) => ({ label: f.name, value: f.id }))}
                            value={form.watch("factorsIDs") || []}
                            onValueChange={(val) => form.setValue("factorsIDs", val)}
                            placeholder="Select Factors"
                        />
                    </div>

                    <DialogFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createLearner.isPending}>
                            {createLearner.isPending ? "Creating..." : "Create Learner"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
