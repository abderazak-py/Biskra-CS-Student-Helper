"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const EditDialog = ({
                               open,
                               onOpenChange,
                               title,
                               description,
                               label,
                               value,
                               onChange,
                               onSave,
                               placeholder,
                               helperText
                           }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onSave: () => void;
    placeholder?: string;
    helperText?: string;
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <Label htmlFor="input">{label}</Label>
                <Input id="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
                {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={onSave}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);
