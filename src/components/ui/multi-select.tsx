"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
    label: string;
    value: string;
};

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
}

export function MultiSelect({
                                options,
                                value,
                                onValueChange,
                                placeholder = "Select options...",
                            }: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const toggleOption = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onValueChange(value.filter((v) => v !== optionValue));
        } else {
            onValueChange([...value, optionValue]);
        }
    };

    const selectedOptions = options.filter((opt) => value.includes(opt.value));

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                    >
                        <div className="flex flex-wrap gap-1">
                            {selectedOptions.length > 0 ? (
                                selectedOptions.map((opt) => (
                                    <Badge
                                        key={opt.value}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        {opt.label}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleOption(opt.value);
                                            }}
                                        />
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground">{placeholder}</span>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {options.map((opt) => (
                                    <CommandItem
                                        key={opt.value}
                                        onSelect={() => toggleOption(opt.value)}
                                    >
                                        <div
                                            className={`mr-2 h-4 w-4 border rounded-sm flex items-center justify-center ${
                                                value.includes(opt.value) ? "bg-primary text-white" : ""
                                            }`}
                                        >
                                            {value.includes(opt.value) && "✓"}
                                        </div>
                                        {opt.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
