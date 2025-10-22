'use client';

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Upload,
    X,
    Plus,
    ChevronRight,
    ChevronLeft,
    Check,
    BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { LessonForm } from '@/components/courses/lessonsFrom';
import { MultiSelect } from '@/components/ui/multi-select';
import { groupService } from '@/service/api/group/groupService';
import { factorService } from '@/service/api/factor/factorService';
import {axiosClient} from "@/api/apiClient";

// ------------ Interfaces ----------------
interface TagRequest {
    name: string;
    color: string;
}

export interface LessonItem {
    file: File;
    time: string;
}

interface QuestionItem {
    question: string;
    choices: string[];
    answer: string[];
    isMultiChoose: boolean;
}

export interface LessonItem {
    file: File;
    time: string;
}

interface FormDataModel {
    title: string;
    description: string;
    estimatedTime: string;
    dueDate: string;
    multiGroups: string[];
    factors: string[];
    tags: TagRequest[];
    thumbnail: File | null;
    lessons: LessonItem[];
    questions: QuestionItem[];
}

// ---------------- API ----------------
const createCourse = async (formData: FormDataModel) => {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('estimatedTime', formData.estimatedTime || '0');

        if (formData.dueDate) {
            const formattedDueDate = `${formData.dueDate}T00:00:00Z`;
            data.append('dueDate', formattedDueDate);
        }

        // ✅ Append multiple values correctly
        formData.multiGroups.forEach((g) => data.append('groups', g));
        formData.factors.forEach((f) => data.append('factors', f));
        data.append('tags', JSON.stringify(formData.tags));

        if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);

        formData.lessons.forEach((l) => {
            let time = l.time;
            if (/^\d{2}:\d{2}$/.test(time)) {
                time = `${time}:00`;
            }
            data.append('lessons', l.file);
            data.append('lessonTimes', time);
        });

        // ✅ Append Questions as JSON string
        data.append('questions', JSON.stringify(formData.questions));

        console.log([...data]);

        // ✅ Correct Axios usage
        const res = await axiosClient.post('/courses', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
    }
;

// ------------ Component ----------------
export default function CreateCoursePage() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<FormDataModel>({
        title: '',
        description: '',
        estimatedTime: '',
        dueDate: '',
        multiGroups: [],
        factors: [],
        tags: [],
        thumbnail: null,
        lessons: [],
        questions: [],
    });

    const [tagInput, setTagInput] = useState<TagRequest>({
        name: '',
        color: '#3b82f6',
    });

    const { data: groups = [] } = useQuery({
        queryKey: ['groups'],
        queryFn: groupService.getAllGroups,
    });

    const { data: factors = [] } = useQuery({
        queryKey: ['factors'],
        queryFn: factorService.getAllFactor,
    });

    const mutation = useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            alert('✅ Course created successfully!');
            setFormData({
                title: '',
                description: '',
                estimatedTime: '',
                dueDate: '',
                multiGroups: [],
                factors: [],
                tags: [],
                thumbnail: null,
                lessons: [],
                questions: [],
            });
            setStep(0);
        },
        onError: (e) => alert(`❌ ${e.message}`),
    });

    const addTag = () => {
        if (tagInput.name.trim()) {
            setFormData({
                ...formData,
                tags: [...formData.tags, { ...tagInput }],
            });
            setTagInput({ name: '', color: '#3b82f6' });
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) setFormData({ ...formData, thumbnail: f });
    };

    const removeLesson = (i: number) => {
        setFormData({
            ...formData,
            lessons: formData.lessons.filter((_, x) => x !== i),
        });
    };

    const removeQuestion = (i: number) => {
        setFormData({
            ...formData,
            questions: formData.questions.filter((_, x) => x !== i),
        });
    };

    const handleSubmit = () => mutation.mutate(formData);

    // Local Question Form
    const [q, setQ] = useState('');
    const [choices, setChoices] = useState<string[]>(['']);
    const [answer, setAnswer] = useState<string[]>([]);
    const [isMultiChoose, setIsMultiChoose] = useState(false);

    const addChoice = () => setChoices([...choices, '']);
    const updateChoice = (i: number, val: string) => {
        const updated = [...choices];
        updated[i] = val;
        setChoices(updated);
    };

    const toggleAnswer = (choice: string) => {
        if (answer.includes(choice))
            setAnswer(answer.filter((a) => a !== choice));
        else if (!isMultiChoose)
            setAnswer([choice]);
        else setAnswer([...answer, choice]);
    };

    const addQuestion = () => {
        if (!q.trim()) return;
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                { question: q, choices, answer, isMultiChoose },
            ],
        });
        setQ('');
        setChoices(['']);
        setAnswer([]);
    };

    return (
        <div className="h-screen bg-gradient-to-br  py-12 px-4 overflow-y-scroll">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-xl">
                    <CardHeader className="">
                        <CardTitle className="text-3xl">Create New Course</CardTitle>
                        <CardDescription >
                            Fill in the details to create your course
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 py-6 space-y-6">
                        {/* Step 1: Details */}
                        {step === 0 && (
                            <>
                                <div>
                                    <Label>Course Title *</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Estimated Time (minutes)</Label>
                                        <Input
                                            type="number"
                                            value={formData.estimatedTime}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    estimatedTime: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label>Due Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, dueDate: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Thumbnail</Label>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                    />
                                </div>

                                <div>
                                    <Label>Groups</Label>
                                    <MultiSelect
                                        options={groups.map((g: any) => ({
                                            label: g.name,
                                            value: g.id,
                                        }))}
                                        value={formData.multiGroups}
                                        onValueChange={(values) =>
                                            setFormData({ ...formData, multiGroups: values })
                                        }
                                        placeholder="Select groups..."
                                    />
                                </div>

                                <div>
                                    <Label>Factors</Label>
                                    <MultiSelect
                                        options={factors.map((f: any) => ({
                                            label: f.name,
                                            value: f.id,
                                        }))}
                                        value={formData.factors}
                                        onValueChange={(values) =>
                                            setFormData({ ...formData, factors: values })
                                        }
                                        placeholder="Select factors..."
                                    />
                                </div>

                                <div>
                                    <Label>Tags</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={tagInput.name}
                                            onChange={(e) =>
                                                setTagInput({ ...tagInput, name: e.target.value })
                                            }
                                            placeholder="Tag name"
                                            className="flex-1"
                                        />
                                        <Input
                                            type="color"
                                            value={tagInput.color}
                                            onChange={(e) =>
                                                setTagInput({ ...tagInput, color: e.target.value })
                                            }
                                            className="w-16"
                                        />
                                        <Button onClick={addTag} size="icon">
                                            <Plus />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.tags.map((t, i) => (
                                            <Badge
                                                key={i}
                                                style={{ backgroundColor: t.color }}
                                                className="gap-1 text-white"
                                            >
                                                {t.name}
                                                <button
                                                    onClick={() =>
                                                        setFormData({
                                                            ...formData,
                                                            tags: formData.tags.filter((_, x) => x !== i),
                                                        })
                                                    }
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 2: Lessons */}
                        {step === 1 && (
                            <>
                                <LessonForm
                                    onSubmit={(lesson) =>
                                        setFormData({
                                            ...formData,
                                            lessons: [...formData.lessons, lesson],
                                        })
                                    }
                                >
                                    <Button variant="outline" className="gap-2">
                                        <BookOpen className="w-4 h-4" /> Add Lesson
                                    </Button>
                                </LessonForm>

                                {formData.lessons.length > 0 && (
                                    <div className="space-y-4 mt-4">
                                        {formData.lessons.map((l, i) => (
                                            <div
                                                key={i}
                                                className="p-4 border rounded-lg flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-medium">{l.file.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Time: {l.time || 'Not set'}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeLesson(i)}
                                                >
                                                    <X />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Step 3: Questions */}
                        {step === 2 && (
                            <>
                                <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
                                    <div>
                                        <Label>Question</Label>
                                        <Input
                                            value={q}
                                            onChange={(e) => setQ(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label>Choices</Label>
                                        {choices.map((c, i) => (
                                            <div key={i} className="flex gap-2 items-center mb-2">
                                                <Input
                                                    value={c}
                                                    onChange={(e) =>
                                                        updateChoice(i, e.target.value)
                                                    }
                                                    placeholder={`Choice ${i + 1}`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant={
                                                        answer.includes(c) ? 'default' : 'outline'
                                                    }
                                                    size="icon"
                                                    onClick={() => toggleAnswer(c)}
                                                >
                                                    <Check />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={addChoice}>
                                            <Plus className="w-4 h-4 mr-1" /> Add Choice
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isMultiChoose}
                                            onChange={(e) =>
                                                setIsMultiChoose(e.target.checked)
                                            }
                                        />
                                        <Label>Allow multiple answers</Label>
                                    </div>

                                    <Button
                                        onClick={addQuestion}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Add Question
                                    </Button>
                                </div>

                                {formData.questions.length > 0 && (
                                    <div className="space-y-3 mt-4">
                                        {formData.questions.map((q, i) => (
                                            <Card key={i} className="p-3">
                                                <p className="font-semibold">{q.question}</p>
                                                <ul className="list-disc ml-6 text-sm text-gray-600">
                                                    {q.choices.map((c, j) => (
                                                        <li key={j}>
                                                            {c}{' '}
                                                            {q.answer.includes(c) && (
                                                                <span className="text-green-600 font-medium">
                                                                    (Answer)
                                                                </span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeQuestion(i)}
                                                >
                                                    <X />
                                                </Button>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={() => setStep((s) => Math.max(0, s - 1))}
                                disabled={step === 0}
                            >
                                <ChevronLeft className="mr-2" /> Back
                            </Button>
                            {step < 2 ? (
                                <Button onClick={() => setStep((s) => s + 1)}>
                                    Next <ChevronRight className="ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={mutation.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {mutation.isPending ? 'Creating...' : 'Create Course'}{' '}
                                    <Check className="ml-2" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {mutation.isError && (
                    <Alert className="mt-4 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">
                            {(mutation.error as Error)?.message ||
                                'An error occurred while creating the course'}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
