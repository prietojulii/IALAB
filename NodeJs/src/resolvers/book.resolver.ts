import {Query, Resolver} from 'type-graphql';

//Creamos una consulta:

@Resolver() //decorador: es una propuesta que permite añadir metadatos

export class BookResolver{
    @Query(() => String)
    getAll(){
        return "All my books";
    }
}

/*
LUEGO en el localhost:4000/graphql 
(porque asi la llame yo)

incerto la consulta:
    query {
    getAll
    }

y me devolvera:
    "All my books"

*/