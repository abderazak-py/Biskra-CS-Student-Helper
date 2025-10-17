

"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface NavItemProps {
    icon: React.ReactNode,
    label: string,
    href: string,
    isActive?: boolean
}

export default function NavItem({icon, label, href, isActive}: NavItemProps) {


    return (
        <Link href={href}>
            <div
                className={`group z-10 relative w-10 h-10 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200
        ${isActive ? 'bg-primary' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
                <div className={`${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {icon}
                </div>
                <div
                    className="invisible group-hover:visible absolute left-14 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {label}
                </div>
            </div>
        </Link>
    );
}
