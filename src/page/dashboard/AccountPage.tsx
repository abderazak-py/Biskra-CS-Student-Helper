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
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { accountService } from "@/service/api/account/accountService";
import AccountTable from "@/components/accounts/table/account-table";
import { accountColumn } from "@/components/accounts/table/columns";
import {AccountModel} from "@/model/accountModel";
import AccountModal from "@/components/accounts/ui/AccountModal";

export default function AccountPage() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

    const { data = [], isLoading, isError } = useQuery<AccountModel[]>({
        queryKey: ["accounts"],
        queryFn: accountService.getAllAccounts,
    });
    const filteredAccounts = data?.filter((a) =>
        a.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="headline-medium-em mb-2">Accounts</div>

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Accounts</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="border rounded px-3 body-medium py-1 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedGroups([]);
                        }}
                    >
                        Clear All Filters
                    </Button>
                </div>

                <div>
                    <Button onClick={() => setOpen(true)}>+ Create Account</Button>
                </div>
            </div>

            {/* Table */}
            <div className="mt-4">
                {isLoading && <p>Loading Accounts...</p>}
                {isError && <p className="text-red-500">Failed to load accounts</p>}
                {!isLoading && !isError && (
                    <AccountTable
                        columns={accountColumn()}
                        data={filteredAccounts}
                        onCourseClick={() => {}}
                    />
                )}
            </div>

            {/* Modal */}
            <AccountModal open={open} onClose={() => setOpen(false)} />
        </div>
    );
}
