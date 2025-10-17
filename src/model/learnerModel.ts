


export interface LearnerModel {
    id:string;
    firstName: string;
    lastName: string;
    email: string;
    groupName: string;
    groupID: string;
    factors: LearnerFactorsDto[];
}

export type LearnerRequestDto = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    groupId: string;        // uuid as string
    factorsIDs: string[];   // array of uuids
};

export interface LearnerAdminResponseDto {
    learner: LearnerResponseDto;
    enrollments: EnrollmentLearnerAdminResponse[];
}

export interface LearnerResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    groupName: string;
    groupID: string;
    factors: LearnerFactorsDto[];
}
export interface LearnerFactorsDto {
    id: string;
    factorName: string;
}
export interface EnrollmentLearnerAdminResponse {
    id: string;
    courseTracking: CourseTrackingResponse;
}

export interface CourseTrackingResponse {
    id: string;
    courseName: string;
    courseThumbnail: string;
    completed: boolean;
    started: boolean;
    score: number;
    passed: boolean;
}
