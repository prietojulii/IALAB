import { Mutation, Resolver, Arg, Ctx, UseMiddleware} from 'type-graphql';
import { Book } from '../entity/book.entity';
import {getRepository, IsNull, Repository} from 'typeorm' 
import { isUser, IContext } from '../middlewares/user.middlewares';
import { User } from '../entity/user.entity';
import { Loan } from '../entity/loan.entity';
import {BookIdInput} from './inputs.resolver';



@Resolver() 
export class LoanResolver{
    bookRepository :  Repository<Book>;
    userRepository: Repository<User>;
    loanRepository: Repository<Loan>;
    LimitResivedBooks: number ;
    timeLimit: Number;

    constructor()
    {
        this.bookRepository = getRepository(Book);
        this.userRepository = getRepository(User);
        this.loanRepository = getRepository(Loan);
        this.LimitResivedBooks = 3;
        this.timeLimit = 604800000; //una semana en milisegundos
    };

    @Mutation( () => Loan)
    @UseMiddleware(isUser)  
    async createLoan( @Arg("bookId", ()=> BookIdInput) input: BookIdInput,
                       @Ctx() context: IContext): Promise <Loan | undefined>
    {   
        try{
            //Identifico el usuario
            const userFound = await this.userRepository.findOne(context.payload.userId);
            if(!userFound){
                const error = new Error("Error user not found");
                throw error; 
            }
            //Verifico si el usuario no supera el limite de libros prestado
            const loans: Loan[] = userFound.loans;
            if(!loans || loans.length >= this.LimitResivedBooks ){
                const error = new Error("You have exceeded the limit number of books");
                throw error;
            }
            //Compruebo si otra persona no tiene el libro
            const bookFound = await this.bookRepository.findOne(input.id,
                                                        {where: {loan: IsNull() }});
            if(!bookFound){
                const error = new Error("This book does not available");
                throw error;
            }
            const loan = await this.loanRepository.insert({book: bookFound,
                                              holder: userFound});

            return await this.loanRepository.findOne(loan.identifiers[0].id,{
                                            relations: ['holder', 'holder.loans',
                                                        'book', 'book.author']})
            
        }catch(e: any){
            throw new Error(e.message);
        }
        
        
    };

    @Mutation( () => Book)
    @UseMiddleware(isUser)
    async returnBook(@Arg("bookId", ()=> BookIdInput) input: BookIdInput,
                     @Ctx() context: IContext): Promise <Book | undefined>
    {
        try{
            //Identifico el usuario
            const userFound = await this.userRepository.findOne(context.payload.userId);
            if(!userFound){
                const error = new Error("Error user not found");
                throw error; 
            }
            
            //Verifico que el id del libro exista
            const book = await this.bookRepository.findOne(input.id);
            if(!book){
                const error = new Error("Book ID is incorrect");
                throw error;
            }
            //Verifico si el libro fue prestado y el usuario fue el poseedor de este
            const loan = await this.loanRepository.findOne({where: {book}});
            if( !loan || loan.holder != userFound){
                const error = new Error("The requested loan does not belong to you or does not exist");
                throw error;
            }
            //comprobamos Si paso el limite de tiempo de prestamo
            if (Number(loan.DateLoad) - Date.now() > this.timeLimit){
                alert("You received a fine for exceeding the time limit");
            }
            //borramos el libro
            await this.loanRepository.delete(loan.id);
            //retorna el nuevo estado del libro
            return  await this.bookRepository.findOne(input.id,{relations: ['loan','author','author.books']});

        }catch(e: any){
            throw new Error(e.mensaje);
        }
    }
}