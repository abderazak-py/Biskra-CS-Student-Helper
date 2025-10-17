'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LessonItem } from '@/page/dashboard/CourseCreatePage';

interface LessonFormProps {
    onSubmit: (lesson: LessonItem) => void;
    children?: React.ReactNode;
}

export function LessonForm({ onSubmit, children }: LessonFormProps) {
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const handleSubmit = () => {
        if (!image) return alert('Please upload a lesson file');

        // تأكد من تنسيق المدة بصيغة HH:MM:SS
        const hh = hours.padStart(2, '0') || '00';
        const mm = minutes.padStart(2, '0') || '00';
        const time = `${hh}:${mm}:00`;

        onSubmit({ file: image, time });
        setOpen(false);
        setImage(null);
        setHours('');
        setMinutes('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Lesson</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Lesson File *</Label>
                        <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                    </div>

                    <div>
                        <Label>Lesson Duration (HH:MM)</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="number"
                                min="0"
                                max="23"
                                placeholder="Hours"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="w-24 text-center"
                            />
                            <span className="text-lg font-medium">:</span>
                            <Input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="Minutes"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                className="w-24 text-center"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} className="bg-blue-600 text-white">
                        Save Lesson
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
