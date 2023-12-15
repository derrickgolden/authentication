export interface PersonDetails{
    email: string,
    password: string,
    confirm_password: string,
}
export interface SignupDetails{
    last_name: string, 
    first_name: string, 
    email: string, 
    remember_me: boolean, 
    country: any, 
    password: string, 
    phone: string
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