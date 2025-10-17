"use client";

import React from "react";
import {
    Goal,
    ContactRound,
    Group,
    BookOpenText, ShieldUser,
    ArrowRightFromLine,
} from "lucide-react";
import { usePathname } from "next/navigation";
import NavItem  from "../../components/ui/nav-item";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
interface DashboardLayoutProps {
    children: React.ReactNode;
}
import Logo from "../../../public/logo/company/Sonatrach.svg"
export default function DashboardLayout({children}: DashboardLayoutProps) {
    const pathname = usePathname();

    const navItems = [
        {icon: <Group className="w-4 h-4"/>, label: "Groups", href: "/dashboard/groups"},
        {icon: <BookOpenText   className="w-4 h-4"/>, label: "Courses", href: "/dashboard/courses"},
        {icon: <Goal   className="w-4 h-4"/>, label: "Factors", href: "/dashboard/factors"},
        {icon: <ContactRound   className="w-4 h-4"/>, label: "Learners", href: "/dashboard/learners"},
        {icon: <ShieldUser   className="w-4 h-4"/>, label: "Account", href: "/dashboard/accounts"},
    ];

    return (
        <div className="bg-white flex w-full h-screen overflow-hidden">
            <div
                className="z-20 h-screen bg-[#f9f9f9] flex flex-col items-center py-4 fixed shadow-sm border-r border-gray-100 w-16">
                {/* Logo */}
                <Link href={"/dashboard"}>
                    <div className="w-12 h-12 bg-gray-200 p-2 rounded-md flex items-center justify-center mb-6">
                        <Image
                            src={Logo}
                            alt="Company Logo"
                            width={35}
                            height={50}
                        />
                    </div>
                </Link>

                {/* Navigation */}
                <div className="flex flex-col gap-[400px]">
                    <div className="flex flex-col gap-4 mt-8">
                        {navItems.map((item,indx) => (
                            <NavItem
                                key={indx}
                                icon={item.icon}
                                label={item.label}
                                isActive={pathname.includes(item.href)}
                                href={item.href}
                            />
                        ))}
                    </div>
                    <div>
                        <Button variant={"destructive"} onClick={()=>{
                            localStorage.removeItem("token");

                            document.cookie = "token=; path=/; max-age=0;";

                            window.location.href = "/auth/login";
                        }} >
                            <ArrowRightFromLine />
                        </Button>
                    </div>
                </div>

            </div>

            <div className="z-10 flex-1 p-4 ml-16">{children}</div>
        </div>
    );
}
