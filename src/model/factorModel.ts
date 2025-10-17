

export interface FactorModel {
    id: string;
    name: string;
    description: string;
    learners : number
}

export interface FactorRequestModel {
    name: string;
    description: string;
    learners: string[]
}