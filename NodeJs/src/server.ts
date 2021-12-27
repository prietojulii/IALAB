import express from 'express';
import 'reflect-metadata'; //es importante para las dependencias de las siguientes...:
import { ApolloServer } from 'apollo-server-express'; //permite tener disponible graphql
import { BookResolver } from './resolvers/book.resolver';
import { buildSchema } from 'type-graphql'; //convierte JS en graphQl

export async function startServer()
{
    const app = express(); //incializamos un seridor http

    const apolloServer = new ApolloServer({
        schema: await buildSchema({resolvers: [BookResolver]})
    });
    
    await apolloServer.start();
    apolloServer.applyMiddleware({app,path: '/graphql'});
    return app;
};