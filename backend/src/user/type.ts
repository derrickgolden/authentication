export interface DBServicesRes{
    success: boolean,
    msg: string
}

export interface PersonDetails{
    email: string,
    password: string,
    confirm_password: string,
    auth_with?: "google" | "app",
}
export interface SignupDetails{
    last_name: string, 
    first_name: string, 
    email: string, 
    remember_me: boolean, 
    country: string, 
    hash: string, 
    password: string, 
    phone: string
}

export interface LoginMysqlRes{
    user_id: number, first_name:string, last_name:string, email:string, remember_me: boolean, 
    country: string, total_deposit: number, total_withdraw: number, balance: number, 
    password?: string, picture: string
}

export interface LoginResponse{
    userAvailable: boolean,
    passwordHash?: string,
    details?: [LoginMysqlRes],
    res?: DBServicesRes
}

export interface SignupResponse{
    success: boolean,
    admin_id?: number,
    msg: string,
    rejectInput?: string,
    details?: Array<{}>
}

// link token
export interface LinkTokenRes extends DBServicesRes{
    email?: string, user_id?: number
}

// google signin/up
export interface GoogleUserProfile {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
  }