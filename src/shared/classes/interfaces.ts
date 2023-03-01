export interface JWTPayload{
    _id: string;
    fullName: string;
    email: string; 
    mobile: string;
    roles: string;
    // role: string;
    // timestamp: number;  
    // exp: number; 
    userTypeId?: string;
}

export interface ResponseData {
    success: boolean;
    code?: number;
    message: string;
    data: Record<string, unknown>;
}

export interface GenericMatch {
    [key: string]: string | number | Date | any;
}
