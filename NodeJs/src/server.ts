import express from 'express';

export async function startServer()
{

    const app = express(); //incializamos un seridor http
    return app;
};

