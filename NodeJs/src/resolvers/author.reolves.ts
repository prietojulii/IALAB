import {InputType, Mutation, Resolver, Field, Arg, Query} from 'type-graphql';
import { Author } from '../entity/author.entity';
import {getRepository, Repository} from 'typeorm' 

// @ts-check
//Creamos las INPUT de las consultas

@InputType()
class AuthorInput{

    @Field()
    fullName !: string
} 

//Creamos una CONSULTA:

@Resolver() //decorador: declaramos la clase como tipo Resolver
export class AuthorResolver{
    
    authorRepository :  Repository<Author>;


    constructor()
    {
        this.authorRepository = getRepository(Author);
    };


    @Mutation( () => Author )                               //parametro                 //retorno
    async createAuthor(  @Arg("input", ()=>AuthorInput) input: AuthorInput ): Promise <Author | undefined> 
    {
        try{

            const createdAuthor = await this.authorRepository.insert({fullName: input.fullName});
            const result = await this.authorRepository.findOne(createdAuthor.identifiers[0].id);
            return result; //retorna un autor
        
        }catch{ 
            console.error;
        }
        
    }

    @Query(() => String)
    getAllA(){
        return "All my books";
    }
}

/*
DEFINICIONES:

    Mutation: guardar o generar datos en nuestra base de datos

    ENTITY MANAGER: dministrar (insertar, actualizar, eliminar, cargar, etc.) cualquier entidad. 
    EntityManager es como una colección de todos los repositorios de entidades en un solo lugar

    REPOSITORIO: Es igual, EntityManagerpero sus operaciones se limitan a una entidad concreta.

    GRAPQL: aphQL es un lenguaje de consulta para API y un tiempo de ejecución para completar esas 
    consultas con sus datos existentes. GraphQL proporciona una descripción completa y comprensible 
    de los datos en su API.

    DECORADORES (@...):Los decoradores son una propuesta para incluir en JavaScript 
    que nos permite añadir anotaciones y metadatos o cambiar el comportamiento de clases, 
    propiedades, métodos, parámetros y accesor.
    SON FUNCIONES COMUNES QUE SE EJECUTAN !
*/