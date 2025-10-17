
export enum UserRole {
    admin= 'admin',
    manger= 'manger',
    learner= 'learner'
}

export interface AuthenticationResponse {
    access_token:string,
    refresh_token:string,
    role:UserRole,
}

export interface AuthenticationRequest {
    email: string,
    password: string,
}