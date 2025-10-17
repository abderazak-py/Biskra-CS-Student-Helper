"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Tag, Pencil } from "lucide-react";
import {LearnerFactorsDto, LearnerResponseDto} from "@/model/learnerModel";


const getInitials = (f?: string, l?: string) => `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

type ProfileInfoProps = {
    learner: LearnerResponseDto;

}

export const ProfileInfo = ({learner} : ProfileInfoProps) => {




    const initials = getInitials(learner.firstName, learner.lastName);

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 rounded-sm w-24">
                        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {learner.firstName} {learner.lastName}
                        </h1>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                            <Mail className="h-3 w-3" />
                            {learner.email}
                        </p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <p className="text-sm font-medium">Group</p>
                                {/*<Button variant="ghost" size="sm" className="h-7 px-2"*/}
                                {/*        onClick={() => { setGroupName(learner.groupName || ""); setEditGroupOpen(true); }}>*/}
                                {/*    <Pencil className="h-3 w-3" />*/}
                                {/*</Button>*/}
                            </div>
                            <p className="text-sm text-muted-foreground">{learner.groupName}</p>
                        </div>
                    </div>

                    {/* Factors */}
                    <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <div className="flex justify-between mb-2">
                                <p className="text-sm font-medium">Factors</p>
                                {/*<Button variant="ghost" size="sm" className="h-7 px-2"*/}
                                {/*        onClick={() => { setFactorsInput(learner.factorsNames?.join(", ") || ""); setEditFactorsOpen(true); }}>*/}
                                {/*    <Pencil className="h-3 w-3" />*/}
                                {/*</Button>*/}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {learner.factors?.length
                                    ? learner.factors.map((f: LearnerFactorsDto, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-xs">{f.factorName}</Badge>
                                    ))
                                    : <span className="text-sm text-muted-foreground">None</span>}
                            </div>
                        </div>
                    </div>
                </div>


            </CardContent>
        </Card>
    );
};
