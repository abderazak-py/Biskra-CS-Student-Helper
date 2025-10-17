"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/service/api/account/accountService";
import { AccountModel } from "@/model/accountModel";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AccountModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AccountModal({ open, onClose }: AccountModalProps) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<AccountModel>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "manager",
    });

    // ✅ Local error state for backend feedback
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: (newAccount: AccountModel) =>
            accountService.createAccount(newAccount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] }).then((r)=>r);
            setErrorMessage(null);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "manager",
            });
            onClose();
        },
        onError: (error: any) => {
            const msg =
                error?.response?.data?.error ||
                error?.error ||
                "An unexpected error occurred";
            setErrorMessage(msg);
        },
    });

    const handleSubmit = () => {
        setErrorMessage(null);
        mutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Account</DialogTitle>
                </DialogHeader>

                {/* ✅ Error box (like in LearnerForm) */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                        {errorMessage}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <Label>First Name</Label>
                        <Input
                            value={formData.firstName}
                            onChange={(e) =>
                                setFormData({ ...formData, firstName: e.target.value })
                            }
                            placeholder="John"
                        />
                    </div>

                    <div>
                        <Label>Last Name</Label>
                        <Input
                            value={formData.lastName}
                            onChange={(e) =>
                                setFormData({ ...formData, lastName: e.target.value })
                            }
                            placeholder="Doe"
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <Label>Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(val) =>
                                setFormData({ ...formData, role: val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={mutation.isPending}>
                        {mutation.isPending ? "Creating..." : "Create Account"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
