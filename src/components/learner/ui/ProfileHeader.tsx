"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2 } from "lucide-react";
import {HamburgerMenuIcon} from "@radix-ui/react-icons";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {LearnerResponseDto} from "@/model/learnerModel";
import LearnerGroupModal from "@/components/learner/ui/LearnerGroupModal";
import AddLearnerFactorsModal from "@/components/learner/ui/AddLearnerFactorModal";
import LearnerDeleteFactorModal from "@/components/learner/ui/DeleteLearnerFactorModal";
interface ProfileHeaderProps {
    onEditGroup?: () => void;
    onEditFactors?: () => void;
    learner: LearnerResponseDto;
}

export function  ProfileHeader({ onEditGroup, onEditFactors,learner }: ProfileHeaderProps)   {
   const router = useRouter();
    const [open, setOpen] = useState(false);
    const [openGroupModal, setOpenGroupModal] = useState<boolean>(false);
    const [openFactorModal, setOpenFactorModal] = useState<boolean>(false);
    const [openDeleteFactorModal, setopenDeleteFactorModal] = useState<boolean>(false);


    return (
        (
            <div className="border-b bg-background">
                <div className="py-4 flex justify-between items-center">
                    <Button variant="ghost" onClick={()=>router.push("/dashboard/learners")} size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    <DropdownMenu open={open} onOpenChange={setOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="sm">
                                <HamburgerMenuIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpen(false);
                                    setOpenGroupModal(true)
                                }}
                            >
                                Edit Group
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpen(false);
                                    setOpenFactorModal(true)
                                }}
                            >
                                Add Factors
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setOpen(false);
                                    setopenDeleteFactorModal(true)
                                }}
                            >
                                Delete Factor
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <LearnerGroupModal open={openGroupModal} onClose={()=>{
                        setOpenGroupModal(false)
                        setOpen(false)
                    }} learner={learner} />
                    <AddLearnerFactorsModal
                        open={openFactorModal}
                        onClose={()=>{
                            setOpenFactorModal(false)

                        }}
                        learner={learner}
                    />
                    <LearnerDeleteFactorModal
                        open={openDeleteFactorModal}
                        onClose={()=>{
                            setopenDeleteFactorModal(false)
                        }}
                        learner={learner}
                    />
                </div>
            </div>
        )
    )
};
