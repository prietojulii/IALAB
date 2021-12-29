import {InputType, Mutation, Resolver, Field, Arg, Query} from 'type-graphql';
import { Book } from '../entity/book.entity';
import { Author } from '../entity/author.entity';
import {getRepository, Repository} from 'typeorm' 
import {Length} from 'class-validator'

//Inputs:
  //"!" -> obligatorio
  //"?" -> opcionales

@InputType()
class BookIdInput{

    @Field( ()=> Number)
    id !: number
} 

@InputType()
class BookInput{
    
    @Field()
    @Length(3,64)
    title !: string;
    
    @Field() 
    author !: number;
}

@InputType()
class BookUpdateInput{ 

    @Field( ()=> String, {nullable: true})
    @Length(3,64)
    title ?: string;

    @Field(()=> Number, {nullable:true}) 
    author ?: number;

}

class BookParse{ 
 
    @Field( ()=> String, {nullable: true})
    title ?: string;

    @Field(()=> Author, {nullable:true})
    author ?: Author;
}

//Creamos una consulta:

@Resolver() //decorador: es una propuesta que permite añadir metadatos
export class BookResolver{
    
    bookRepository :  Repository<Book>;
    authorRepository :  Repository<Author>;


    constructor()
    {
        this.bookRepository = getRepository(Book);
        this.authorRepository = getRepository(Author);
    };



    @Mutation( () => Book )                               //parametro          //retorno
    async createBook(  @Arg("input", ()=>BookInput) input: BookInput ): Promise<Book | undefined>
    {
        try{
            const author: Author | undefined = await this.authorRepository.findOne(input.author);
            if(!author){ 
              const error = new Error ( 'author does not exist in DB');
              throw error;
            }
            const book = await this.bookRepository.insert({
                title: input.title,
                author: author,
            });
                                                                           //le carga al libro el enlace de su author
            return await this.bookRepository.findOne(book.identifiers[0].id,   {relations: ['author']});
        }catch(e: any) {
            throw new Error(e.message);
        }

    }


    @Mutation( ()=> Book)
    async updateBookById( @Arg("input",()=>BookUpdateInput) input: BookUpdateInput,
                          @Arg("bookId", ()=>BookIdInput) bookId: BookIdInput 
                        ): Promise <Book | undefined>
    { 
        try{
            const bookExist = await this.bookRepository.findOne(bookId.id);
            if(!bookExist){
                throw new Error("Book does not exists");
            }
            //actualizo los nuevo valores del libro
            await this.bookRepository.update( bookId.id, await this.parseInput(input));
            //retorno el libro incluyendo sus campos relacionales
            const newBook = await this.bookRepository.findOne(bookId.id, {relations: ['author']});
            return newBook;
        }catch(e: any){
            throw new Error(e);
        }
    };


    @Mutation( ()=> Boolean)
    async deleteBook( @Arg("input",()=>BookIdInput) input: BookIdInput): Promise <Boolean>
    {
        try{

            const bookExists = await this.bookRepository.findOne(input.id);
            if(!bookExists){
                const error = new Error("Book does not exists");
                throw error;
            }
            await this.bookRepository.delete(input.id);
            return true;
        }catch(e: any){
            throw new Error(e.message);
            return false;
        }
    
    }



    @Query(() => [Book])
    async getAllBooks(): Promise<Book[]>
    {
        try{

            return await this.bookRepository.find({relations: ['author']}); //devuelve un array de objetos Author
        }catch(e: any){
            throw new Error(e);
        }
    };


    @Query( ()=> Book)
    async getBookById(  @Arg("input", ()=>BookIdInput) input: BookIdInput ): Promise <Book | undefined>
    { //recibe un argumento AuthorId
        try{
            const book = await this.bookRepository.findOne(input.id, {relations: ['author']});
            if(!book){
               const error = new Error('Book does not exists');
               throw error;
            }
            return book;
        }catch(e: any){
            throw new Error(e);
        }
        
    };

    /**
     * Convierte un objeto de tipo BookUpdateInput a BookParse, de modo que los campos "author" coincidan
     * con el tipo "Author" en vez de "Number"
    */
    private async parseInput(input: BookUpdateInput): Promise <BookParse> {

        const parsed: BookParse = {};
        try{

            parsed.title = input.title;
            parsed.author = await this.authorRepository.findOne(input.author, {relations: ['books']});
            
            if(!parsed.author){
                const error= new Error ("Error ID author");
                throw error;
            }
            return parsed;
            
        }catch(e: any){
            throw new Error(e);
        }

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