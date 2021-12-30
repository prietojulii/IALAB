import {InputType, Mutation, Resolver, Field, Arg, Ctx, Query, UseMiddleware} from 'type-graphql';
import { Book } from '../entity/book.entity';
import { Author } from '../entity/author.entity';
import {getRepository, IsNull, Repository} from 'typeorm' 
import { isUser, IContext } from '../middlewares/user.middlewares';
import { BookIdInput, BookInput, BookUpdateInput } from './inputs.resolver';


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



    @Mutation( () => Book )                       
    @UseMiddleware(isUser)                                                  //Parametros:
    async createBook(  @Arg("input", ()=>BookInput) input: BookInput, //argumento: se carga explicitamente
                       @Ctx() context: IContext                       //contexto-> se carga automaticamente
                    ): Promise<Book | undefined> //retorno
    {
        //imprimimos por consola la informacion del usuario
        console.log(context.payload);

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
            return await this.bookRepository.findOne(book.identifiers[0].id,   {relations: ['author', 'author.books']});
        }catch(e: any) {
            throw new Error(e.message);
        }

    }


    @Mutation( ()=> Book)
    @UseMiddleware(isUser)
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
    @UseMiddleware(isUser)
    async deleteBook( @Arg("input",()=>BookIdInput) input: BookIdInput): Promise <Boolean>
    {
        try{

            const isDeleted = await this.bookRepository.delete(input.id);
            if(isDeleted.affected === 0){ //no elimino nada ya sea porque no existia, etc
                return false;
            }
            return true;
        }catch(e: any){
            throw new Error(e.message);
        }
    
    }



    @Query(() => [Book])
    @UseMiddleware(isUser)  
    async getAllBooks(): Promise<Book[]>
    {
        try{
            //FILTRO solo los que no estan prestados
            return await this.bookRepository.find({where: {loan: IsNull() },
                                                    relations: ['author', 'author.books', 'loan'],
                                                    order: {title: 'ASC'}}); 
        }catch(e: any){
            throw new Error(e.message);
        }
    };


    @Query( ()=> Book)
    @UseMiddleware(isUser)  
    async getBookById(  @Arg("input", ()=>BookIdInput) input: BookIdInput ): Promise <Book | undefined>
    { //recibe un argumento AuthorId
        try{
            const book = await this.bookRepository.findOne(input.id, {relations: ['author', 'author.books']});
            if(!book){
               const error = new Error('Book does not exists');
               throw error;
            }
            return book;
        }catch(e: any){
            throw new Error(e.message);
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
            parsed.author = await this.authorRepository.findOne(input.author, {relations: ['books', 'author.books']});
            
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