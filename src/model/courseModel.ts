




export interface CourseModel {
    id: string;
    title: string;
    description: string;
    multiGroups: string[];
    factorsNames : string[];
}


export interface CourseDetailModel {
    id: string;
    title: string;
    description: string;
    estimatedTime: number;
    dueDate: string;
    thumbnailUrl: string;
    groups: CourseGroupsResponseDto[];
    factors : CourseFactorsResponseDto[];
    tags: TagResponse[];
    lessons : LessonsResponseDto[];
    createdAt: string;
    updatedAt: string;
}

export interface LessonsResponseDto {
    imageUrl:string
    time:string
    order:number
}

export interface TagResponse {
    name: string;
    color: string;
}

export interface CourseFactorsResponseDto {
    id:string;
    factorName:string;
}
export interface CourseGroupsResponseDto {
    id:string;
    groupName:string;
}

export interface CourseEnrollmentStatResponse {
    courseId: string;
    title: string;
    assignedGroupCount: number;
    assignedFactorCount: number;
    potentialLearners: number;
    enrolledLearners: number;
    enrollmentRatio: number;
    createdAt: string;
    updatedAt: string;
}