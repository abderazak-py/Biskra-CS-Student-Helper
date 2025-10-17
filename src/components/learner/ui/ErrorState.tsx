"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const ErrorState = ({ error }: { error: string }) => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
                <div className="text-7xl font-bold text-destructive">404</div>
                <p className="text-lg text-muted-foreground">{error}</p>
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Learners
                </Button>
            </CardContent>
        </Card>
    </div>
);