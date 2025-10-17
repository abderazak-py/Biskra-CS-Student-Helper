"use client"
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
import GroupTable from "@/components/groups/table/group-table";
import { groupColumns } from "@/components/groups/table/columns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { groupService } from "@/service/api/group/groupService";

export default function GroupsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const queryClient = useQueryClient();

    // Fetch groups
    const {
        data: groups = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["groups"],
        queryFn: async () => await groupService.getAllGroups(),
    });

    const addGroupMutation = useMutation({
        mutationFn: async (newGroup: { name: string; description: string }) =>
            await groupService.createGroup(newGroup),
        onSuccess: async () => {
            // Option 1: Force refetch immediately
            await refetch();

            // Option 2: Invalidate and refetch
            await queryClient.invalidateQueries({ queryKey: ["groups"] });

            // Reset form and close dialog
            setFormData({ name: "", description: "" });
            setOpen(false);
        },
        onError: (error) => {
            console.error("Error adding group:", error);
            // Optionally show error message to user
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description) return;
        addGroupMutation.mutate(formData);
    };

    // Filter groups
    const filteredGroups = groups.filter(
        (group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="headline-medium-em mb-2">Groups</div>

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Groups</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search groups..."
                        className="border rounded px-3 py-1 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={() => setOpen(true)}>+ Add Group</Button>
                </div>

                {/* Add Group Dialog */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Group</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block mb-1">Name</label>
                                <input
                                    type="text"
                                    className="border rounded px-3 py-1 w-full"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Description</label>
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
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={addGroupMutation.isPending}>
                                    {addGroupMutation.isPending ? "Adding..." : "Add Group"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Table */}
                {isLoading ? (
                    <div className="text-center py-10">Loading groups...</div>
                ) : isError ? (
                    <div className="text-center py-10 text-red-500">
                        Error loading groups
                    </div>
                ) : (
                    <GroupTable columns={groupColumns()} data={filteredGroups} />
                )}
            </div>
        </div>
    );
}