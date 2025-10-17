"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { factorColumns } from "@/components/factor/table/columns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import FactorTable from "@/components/factor/table/factor-table";
import { factorService } from "@/service/api/factor/factorService";
import { learnerService } from "@/service/api/learner/learnerService";
import { Check } from "lucide-react";
import {LearnerResponseDto} from "@/model/learnerModel"; // ✅ import the check icon

export default function FactorPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        learners: [] as string[],
    });

    const queryClient = useQueryClient();

    // Fetch factors
    const {
        data: factors = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["factors"],
        queryFn: async () => await factorService.getAllFactor(),
    });

    // Fetch learners
    const { data: learners = [] } = useQuery({
        queryKey: ["learners"],
        queryFn: async () => await learnerService.getAllLearner(),
    });
    const [allSelected, setAllSelected] = useState(false);
    const [searchLearnerTerm, setSearchLearnerTerm] = useState("");

    const filteredLearners = learners.filter(
        (l) =>
            l.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleSelectAll = () => {
        if (allSelected) {
            setFormData({ ...formData, learners: [] });
        } else {
            setFormData({ ...formData, learners: learners.map((l) => l.id) });
        }
        setAllSelected(!allSelected);
    };
    const addFactorMutation = useMutation({
        mutationFn: async (newFactor: {
            name: string;
            description: string;
            learners: string[];
        }) => await factorService.createFactor(newFactor),
        onSuccess: async () => {
            await refetch();
            await queryClient.invalidateQueries({ queryKey: ["factors"] });
            setFormData({ name: "", description: "", learners: [] });
            setOpen(false);
        },
        onError: (error) => {
            console.error("Error adding factor:", error);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description) return;
        addFactorMutation.mutate(formData);
    };

    const handleSelectLearner = (id: string) => {
        setFormData((prev) => {
            const selected = prev.learners.includes(id);
            return {
                ...prev,
                learners: selected
                    ? prev.learners.filter((l) => l !== id)
                    : [...prev.learners, id],
            };
        });
    };

    const filteredFactors = factors.filter(
        (factor: any) =>
            factor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            factor.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="headline-medium-em mb-2">Factors</div>

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Factors</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search factors..."
                        className="border rounded px-3 py-1 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={() => setOpen(true)}>+ Add Factor</Button>
                </div>

                {/* Add Factor Dialog */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="w-[1000px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add Factor</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label className="block mb-1 font-medium">Name</label>
                                <input
                                    type="text"
                                    className="border rounded px-3 py-1 w-full"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Description Field */}
                            <div>
                                <label className="block mb-1 font-medium">Description</label>
                                <input
                                    type="text"
                                    className="border rounded px-3 py-1 w-full"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            {/* Learner Selection */}
                            <div>
                                <label className="block mb-2 font-medium">Assign Learners</label>

                                {/* 🔍 Search + Select All */}
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Search learners by name..."
                                        className="border rounded px-3 py-1 flex-1"
                                        value={searchLearnerTerm}
                                        onChange={(e) => setSearchLearnerTerm(e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleSelectAll}
                                        className="text-sm"
                                    >
                                        {allSelected ? "Unselect All" : "Select All"}
                                    </Button>
                                </div>

                                {/* 👥 Scrollable Learner Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1 border rounded-md">
                                    {filteredLearners.length === 0 ? (
                                        <p className="text-sm text-gray-500 col-span-2 text-center">
                                            No learners found.
                                        </p>
                                    ) : (
                                        filteredLearners.map((learner: LearnerResponseDto) => {
                                            const selected = formData.learners.includes(learner.id);
                                            return (
                                                <div
                                                    key={learner.id}
                                                    onClick={() => handleSelectLearner(learner.id)}
                                                    className={`relative cursor-pointer border rounded-xl p-3 text-center transition-all select-none shadow-sm ${
                                                        selected
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-200 hover:border-gray-400"
                                                    }`}
                                                >
                                                    {selected && (
                                                        <div className="absolute -top-1 -left-1 bg-blue-500 rounded-full p-1">
                                                            <Check size={8} className="text-white" />
                                                        </div>
                                                    )}
                                                    <div className="font-medium text-sm">
                                                        {learner.firstName} {learner.lastName}
                                                    </div>
                                                    {learner.email && (
                                                        <div className="text-[10px] text-gray-500">
                                                            {learner.email}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={addFactorMutation.isPending}>
                                    {addFactorMutation.isPending ? "Adding..." : "Add Factor"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>


                {/* Table */}
                {isLoading ? (
                    <div className="text-center py-10">Loading factors...</div>
                ) : isError ? (
                    <div className="text-center py-10 text-red-500">
                        Error loading factors
                    </div>
                ) : (
                    <FactorTable columns={factorColumns()} data={filteredFactors} />
                )}
            </div>
        </div>
    );
}
