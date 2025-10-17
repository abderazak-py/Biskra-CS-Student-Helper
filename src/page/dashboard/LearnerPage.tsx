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
import LearnerTable from "@/components/learner/table/learner-table";
import { learnerColumns } from "@/components/learner/table/columns";
import { Button } from "@/components/ui/button";
import LearnerForm from "@/components/learner/form/learnerForm";
import { learnerService } from "@/service/api/learner/learnerService";
import { groupService } from "@/service/api/group/groupService";
import { factorService } from "@/service/api/factor/factorService";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function LearnerPage() {

    const router = useRouter();
    const { data: learners = [], isLoading, isError } = useQuery({
        queryKey: ["learners"],
        queryFn: learnerService.getAllLearner,
    });

    const { data: groups = [] } = useQuery({
        queryKey: ["groups"],
        queryFn: groupService.getAllGroups,
    });

    const { data: factors = [] } = useQuery({
        queryKey: ["factors"],
        queryFn: factorService.getAllFactor,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

    const toggleGroup = (group: string) => {
        setSelectedGroups((prev) =>
            prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
        );
    };

    const toggleFactor = (factor: string) => {
        setSelectedFactors((prev) =>
            prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
        );
    };

    // Filter learners
    const filteredLearners = learners.filter((learner) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            learner.firstName.toLowerCase().includes(search) ||
            learner.lastName.toLowerCase().includes(search)

        const matchesGroups =
            selectedGroups.length === 0 ||
            selectedGroups.includes(learner.groupName || "");

        const matchesFactors =
            selectedFactors.length === 0 ||
            learner.factors?.some((f) => selectedFactors.includes(f.factorName));

        return matchesSearch && matchesGroups && matchesFactors;
    });

    return (
        <div>
            <div className="headline-medium-em mb-2">Learners</div>

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Learners</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Filters */}
            {/* Filters + Add button */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mt-6">

                    <input
                        type="text"
                        placeholder="Search learners..."
                        className="border rounded px-3 py-1 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />



                    {/* Group filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Filter by Group {selectedGroups.length > 0 && `(${selectedGroups.length})`}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            {groups.map((g) => (
                                <DropdownMenuCheckboxItem
                                    key={g.id}
                                    checked={selectedGroups.includes(g.name)}
                                    onCheckedChange={() => toggleGroup(g.name)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {g.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Factor filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Filter by Factor {selectedFactors.length > 0 && `(${selectedFactors.length})`}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            {factors.map((f) => (
                                <DropdownMenuCheckboxItem
                                    key={f.id}
                                    checked={selectedFactors.includes(f.name)}
                                    onCheckedChange={() => toggleFactor(f.name)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {f.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedGroups([]);
                            setSelectedFactors([]);
                        }}
                    >
                        Clear All Filters
                    </Button>

                </div>
                <Button onClick={() => setOpenForm(true)}>+ Add Learner</Button>
            </div>


            {/* Table */}
            <div className="mt-4">
                {isLoading && <p>Loading learners...</p>}
                {isError && <p className="text-red-500">Failed to load learners</p>}
                {!isLoading && !isError && (
                    <LearnerTable
                        columns={learnerColumns()}
                        data={filteredLearners || []}
                        onLearnerClick={(learner) => router.push(`/dashboard/learners/${learner.id}`)}
                    />
                )}
            </div>

            <LearnerForm open={openForm} onClose={() => setOpenForm(false)} />
        </div>
    );
}
