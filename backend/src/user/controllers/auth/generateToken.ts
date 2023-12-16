const jwt = require('jsonwebtoken');
require('dotenv').config()

export interface TokenResponse{
  token: string, exp_date: Date
}

export function generateAuthToken(user_id: number, first_name: string, last_name: string, 
  email: string, expiresInDays: number): TokenResponse {
  // Calculate the expiration date based on the provided expiresInDays
  const exp_date: Date = new Date();
  exp_date.setDate(exp_date.getDate() + expiresInDays);
  console.log(exp_date)

  // Generate a token with the specified expiration time
  const token = jwt.sign(
    { 
        user_id, first_name, last_name, email
    }, 
    process.env.TOKEN_SECRET_KEY, 
    { 
        expiresIn: `${expiresInDays}d` 
    }
  );

  return { token, exp_date };
}


