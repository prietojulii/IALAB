import { MiddlewareFn} from 'type-graphql'
import { verify } from 'jsonwebtoken'
import { Response, Request} from 'express'
import {environment} from '../config/environment'



export interface IContext{
    req: Request,
    res: Response,
    payload: {userId: string};
};


//La siguiente función permite luego usar decoradores que sirvan de autenticación 
//ne ciertas funciones en caso de que se cumpla, sigue . sino Frena.
export const isUser: MiddlewareFn<IContext> = ({context},next) => {
   
    try{
        //recibo el header: "<barrer> <codigo>"
        const barrerToken = context.req.headers["authorization"];
    
        if(!barrerToken){
            const error = new Error("Unauthorized");
            throw error;
        }
        //elimino la  <barrer> del string, separandolo por el espacio
        const jwt = barrerToken.split(" ")[1];
        
        //Decodifico el jwt
        const payload = verify(jwt,environment.JWT_SECRET);
        context.payload = payload as any; //"as" indica que payload es de tipo any == ..payload: any = verify..

    }catch(e: any){
        throw new Error(e);
    }
    return next(); //next es un metodo de expres, indica que continua la ejecución del programa normalmente.
};