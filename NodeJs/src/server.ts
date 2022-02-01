import express from 'express';
import 'reflect-metadata'; //es importante para las dependencias de las siguientes...:
import { ApolloServer } from 'apollo-server-express'; //permite tener disponible graphql
import { buildSchema } from 'type-graphql'; //convierte JS en graphQl
import { BookResolver } from './resolvers/book.resolver';
import { AuthorResolver } from './resolvers/author.reolver';
import {AccountResolver} from './resolvers/account.resolver';
import { LoanResolver } from './resolvers/loan.resolver';
import { AdminResolver } from "./resolvers/administrator.resolver";
export async function startServer()
{
    const app = express(); //incializamos un servidor http
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({resolvers: [AuthorResolver, BookResolver,
                                                 AccountResolver, LoanResolver,
                                                 AdminResolver]}),
        context: ({req,res})=>({req,res}),
        
    });
    
    await apolloServer.start();
    apolloServer.applyMiddleware({app,path: '/graphql'});

    return app;
};