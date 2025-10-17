"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlusCircle, X } from "lucide-react";

type Tag = {
    name: string;
    color: string;
};

interface TagsCardProps {
    course: { tags: Tag[] };
    setCourse: (course: any) => void;
}

export default function TagsCard({ course, setCourse }: TagsCardProps) {
    const [newTag, setNewTag] = useState({ name: "", color: "#2563eb" }); // default blue color

    const handleAddTag = () => {
        if (!newTag.name.trim()) return;
        setCourse({
            ...course,
            tags: [...(course.tags || []), newTag],
        });
        setNewTag({ name: "", color: "#2563eb" });
    };

    const handleRemoveTag = (name: string) => {
        setCourse({
            ...course,
            tags: (course.tags || []).filter((t) => t.name !== name),
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tags</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Existing Tags */}
                <div className="flex flex-wrap gap-2">
                    {course.tags?.length ? (
                        course.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded"
                                style={{ backgroundColor: tag.color + "20", color: tag.color }}
                            >
                {tag.name}
                                <button
                                    onClick={() => handleRemoveTag(tag.name)}
                                    className="ml-1 text-[10px] opacity-70 hover:opacity-100"
                                >
                  <X size={12} />
                </button>
              </span>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">No tags yet</p>
                    )}
                </div>

                {/* Add New Tag */}
                <div className="flex items-center gap-2">
                    <Input
                        value={newTag.name}
                        onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                        placeholder="Tag name"
                        className="flex-1"
                    />
                    <input
                        type="color"
                        value={newTag.color}
                        onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                        className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleAddTag}
                        disabled={!newTag.name.trim()}
                    >
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
