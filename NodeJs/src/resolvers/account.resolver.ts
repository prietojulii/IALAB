import {Resolver, Mutation, ObjectType, Field, Arg, Query, UseMiddleware, Ctx} from 'type-graphql'
import { Repository, getRepository } from 'typeorm'
import {User} from '../entity/user.entity'
import { hash, compareSync, compare} from 'bcryptjs'
import {sign} from 'jsonwebtoken'
import {environment} from '../config/environment'
import { Book } from '../entity/book.entity'
import { Admin } from '../entity/admin.entity'
import { registerInput, LoginInput, UserPassInput } from './inputs.resolver'
import { IContext, isAdmin, isUser } from '../middlewares/user.middlewares'

@ObjectType()
class LoginResponse{

    @Field()
    userId !: Number;

    @Field()
    jwt !: String;

}





@Resolver()
export class AccountResolver{

    userRepository: Repository<User>;
    bookRepository: Repository<Book>;
    adminRepository:  Repository<Admin>;

    constructor(){
        this.userRepository = getRepository(User);
        this.bookRepository  = getRepository(Book);
        this.adminRepository = getRepository(Admin);
    }

    @Mutation(()=>User)
    async registerUser( @Arg("input", ()=>registerInput) input: registerInput): Promise <User | undefined>{
        
        try{
            const {fullName, email, password} = input;
            const userExists = await this.userRepository.findOne({ where: {email} });
            
            if(userExists){ // Si el mail ya esta registrado
                const error = new Error("email is not available");
                throw error;
            }
            
            const hashedPassword = await hash(password,10); // SALT = semilla que genera el hash 
            const newUser = await this.userRepository.insert({ 
                fullName,
                email,
                password: hashedPassword,
            });
            return await this.userRepository.findOne(newUser.identifiers[0].id);

        }catch(e: any){
            throw new Error(e.menssage);
        }
    };


    @Mutation(()=>Admin)
    async registerAdmin( @Arg("input", ()=>registerInput) input: registerInput): Promise <Admin | undefined>{
        
        try{
            const {fullName, email, password} = input;
            const userExists = await this.adminRepository.findOne({ where: {email} });
            
            if(userExists){ // Si el mail ya esta registrado
                const error = new Error("email is not available");
                throw error;
            }
            
            const hashedPassword = await hash(password,10); // SALT = semilla que genera el hash 
            const newUser = await this.adminRepository.insert({ 
                fullName,
                email,
                password: hashedPassword,
            });
            return await this.adminRepository.findOne(newUser.identifiers[0].id);

        }catch(e: any){
            throw new Error(e.menssage);
        }
    };


    @Mutation( ()=> Boolean)
    @UseMiddleware(isUser)
    async deleteUser( @Arg("input",()=>UserPassInput) input: UserPassInput,
                      @Ctx() context: IContext): Promise <Boolean>
    {
        try{
            return await deleteAccount(this.userRepository,
                                    input.password,
                                    context.payload.userId);
        }catch(e: any){
            throw new Error(e.message);
        }
    
    }

    @Mutation( ()=> Boolean)
    @UseMiddleware(isAdmin)
    async deleteAdmin( @Arg("input",()=>UserPassInput) input: UserPassInput,
                      @Ctx() context: IContext): Promise <Boolean>
    {
        try{
            return await deleteAccount(this.adminRepository,
                                    input.password,
                                    context.payload.userId);
        }catch(e: any){
            throw new Error(e.message);
        }
    
    }

    @Mutation( () => LoginResponse)
    async login( @Arg("input", ()=> LoginInput) input: LoginInput): Promise <LoginResponse>
    {

        try{
            const { email, password} = input;
            var userFound: any| undefined= await this.userRepository.findOne({ where: {email} });
            var secret =  environment.JWT_SECRET;
            if(!userFound){

                userFound = await this.adminRepository.findOne({ where: {email} });
                if(!userFound){
                    const error= new Error("Invalid credentials"); 
                    throw error;
                }
                secret =  environment.JWT_SECRET_ADMIN;
            }

            const isValidPasword: boolean = compareSync( password, userFound.password);
            if(!isValidPasword){
                const error= new Error("Invalid credentials");  
                throw error;
            }

            const newJwt: string = sign ({id: userFound.id},secret);
            return { 
                userId: userFound.id,
                jwt: newJwt,

            };

        }catch(e: any){
            throw new Error(e.message);
        }

    }

   

    /*
    !PARA ENCRIPTAR CONTRASEÑA (HASH)
        Librerías instaladas:
        $ npm install bcryptjs
        $ npm install -D @types/bcryptjs
        
        
    !JWT (JSON Web Token): 
        JSON Web Token (JWT) es un estándar abierto (RFC-7519) basado en JSON 
        para crear un token que sirva para enviar datos entre aplicaciones o servicios 
        y garantizar que sean válidos y seguros
        
        Librería intalada:
        $ npm i jsonwebtoken
        $ npm i -D @types/jsonwebtoken

    Los JWT tienen una estructura definida y estándar basada en tres partes:

    *El header
    Es un string en base64 creados a partir dos JSON. 
    {
    "alg": "HS256", (algoritmo usado para en la firma)
    "typ": "JWT" (tipo de token)
    } 
    *El payload
    Es un string en base64 creados a partir dos JSON. 
    es un JSON que puede tener cualquier propiedad, aunque hay una serie de
    nombres de propiedades definidos en el estándar. Ejemplo:
    {
    "id": "1",
    "username": "sergiodxa"
    }
    *Signature
    Por último la firma del JWT se genera usando los anteriores dos campos en base64 y una
    key secreta (que solo se sepa en los servidores que creen o usen el JWT) para usar un 
    algoritmo de encriptación. La forma de hacerlo entonces sería la siguiente (usando pseudo código):
    key =  'secret'
    unsignedToken = base64Encode(header) + '.' + base64Encode(payload)
    signature = SHA256(key, unsignedToken)
    token = unsignedToken + '.' + signature
    De esta forma obtenemos la firma y la agregamos al final de nuestro JWT

    */


};

async function deleteAccount(repository:Repository<any>, password: string, userId: string): Promise<Boolean> {
    //Identifico el usuario
    const userFound = await repository.findOne(userId);
    if(!userFound){
        const error = new Error("Error user not found");
        throw error; 
    }
    if(await compare( password ,userFound.password) ){
        const isDeleted = await repository.delete(userFound.id);
   
        if(isDeleted.affected === 0){ //no elimino nada ya sea porque no existia, etc
           throw new Error("There was an unexpected error. Try again");
       }
   }else{
       alert("Wrong password, try again");
       return false;
   }
   return true;
}