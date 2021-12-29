import {InputType, Mutation, Resolver, Field, Arg, Query} from 'type-graphql';
import { Author } from '../entity/author.entity';
import {getRepository, Repository} from 'typeorm' 
import {Length} from 'class-validator'

// @ts-check
//Creamos las INPUT de las consultas

@InputType()
class AuthorInput{

    @Field()
    @Length(3,64)
    fullName !: string
} 

@InputType()
class AuthorUpdateInput{

    @Field( ()=> Number)
    id !: number //obligatorio

    @Field()
    @Length(3,64)
    fullName ?: string //opcional
} 

@InputType()
class AuthorIdInput{

    @Field( ()=> Number)
    id !: number
} 


//Creamos las  CONSULTAS y Mitaciones:

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
            if(!result){ 
                const error = new Error ( 'author has not been created');
                throw error;
            }
            return result; //retorna un autor
        
        }catch(e: any){ 
            throw new Error(e.message);
        }
        
    };

    @Mutation( ()=> Author)
    async updateAuthorById( @Arg("input",()=>AuthorUpdateInput) input: AuthorUpdateInput): Promise <Author | undefined>
    { 
        const authorExist = await this.authorRepository.findOne(input.id);
        if(!authorExist){
            throw new Error("Author does not exists");
        }

        return await this.authorRepository.save({
 
            id: input.id,
            fullName: input.fullName
        });//save actualiza el valor particuar y si no existe lo crea
    }

    //TODO: no chequea si el author tiene libros existentes en la base de datos
    @Mutation( ()=> Boolean)
    async deleteAuthor( @Arg("input",()=>AuthorIdInput) input: AuthorIdInput): Promise <Boolean>
    {
        try{

            const authorExist = await this.authorRepository.findOne(input.id);
            if(!authorExist){
                const error = new Error("Author does not exists");
                throw error;
            }
            await this.authorRepository.delete(input.id);
            return true;
        }catch(e: any){
            throw new Error(e.message);
        }
    
    }


    @Query(() => [Author])
    async getAllAuthor(): Promise<Author[]>
    {
        try{
            return await this.authorRepository.find({relations: ['books']}); //devuelve un array de objetos Author
        }catch(e: any){
            throw new Error(e);
        }
    };


    @Query( ()=> Author)
    async getAuthorById(  @Arg("input", ()=>AuthorIdInput) input: AuthorIdInput ): Promise <Author | undefined>
    { //recibe un argumento AuthorId

            const author = await this.authorRepository.findOne(input.id, {relations: ['books']});
            if(!author){
               throw new Error('Author does not exists');
            }
            return author;
    };
}

/*
*DEFINICIONES:

    *TypeGraphQL
    es un marco para crear API GraphQL con Node.js y TypeScript. El propósito principal
    de esta herramienta es permitirnos ***DEFINIR NUESTRO ESQUEMA*** directamente desde nuestro código 
    TypeScript.
    *TypeORM
    es una biblioteca de TypeScript que nos permite ***INTERACTUAR CON BASES DE DATOS SQL****
    Con estas herramientas combinadas, podemos construir una API GraphQL

    GRAPHQL: aphQL es un lenguaje de consulta para API y un tiempo de ejecución para completar esas 
     consultas con sus datos existentes. GraphQL proporciona una descripción completa y comprensible 
     de los datos en su API.

        DECORADORES (@...):Los decoradores son una propuesta para incluir en JavaScript 
        que nos permite añadir anotaciones y metadatos o cambiar el comportamiento de clases, 
        propiedades, métodos, parámetros y accesor.
        SON FUNCIONES COMUNES QUE SE EJECUTAN !

            Mutation: guardar o generar datos en nuestra base de datos

            Resolvers: Los esquemas por sí solos no hacen nada: únicamente definen qué se puede 
            hacer en nuestra APIa través de los resolvers, que son FUNCIONES que se encargan de PROCESAR
            cada posible QUERY, MUTACIÓN o SUSCRIPCIÓN de nuestra API y de responder con los datos 
            necesarios, según la definición de nuestro esquema

    TYPEORM: TypeORM es un Object-Relational Mapper / Mapping-tool, o un ORM, es decir una
     librería que los desarrolladores utilizan para crear bases de datos y manipular sus datos 
     sin la necesidad de conocer / usar SQL

        ENTITY MANAGER: dministrar (insertar, actualizar, eliminar, cargar, etc.) cualquier entidad. 
        EntityManager es como una colección de todos los repositorios de entidades en un solo lugar

        REPOSITORIO: Es igual, EntityManagerpero sus operaciones se limitan a una entidad concreta.

*/