export interface PersonDetails{
    email: string;
    password: string;
    confirm_password: string;
}
export interface SignupDetails{
    last_name: string; 
    first_name: string; 
    email: string; 
    remember_me: boolean;
    country: string; 
    password: string; 
    phone: string;
    Signup_with?: "app" | "google";
}

type Country = {
    name: string;
    native: string;
    phone: number[]; // Assuming phone is an array of numbers
    continent: string;
    capital: string;
    currency: string[]; // Assuming currency is an array of strings
    languages: string[]; // Assuming languages is an array of strings
  };
  
  export type CountriesData = {
    [countryCode: string]: Country;
  };

  // google login
  export interface GoogleUser {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    authuser: string;
    prompt: string;
  }
  
  export interface GoogleUserProfile {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    first_name: string; 
    last_name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
    Signup_with?: "app" | "google";
  }