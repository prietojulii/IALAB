import dotenv from 'dotenv';

dotenv.config(); //levanta las environment
export const environment = {

    DB_PORT: process.env.DB_PORT, 
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
};