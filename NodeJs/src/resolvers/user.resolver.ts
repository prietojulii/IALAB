import {Resolver, Mutation, ObjectType, Field, Arg, Query} from 'type-graphql'
import { Repository, getRepository } from 'typeorm'
import {User} from '../entity/user.entity'
import { hash, compareSync} from 'bcryptjs'
import {sign} from 'jsonwebtoken'
import {environment} from '../config/environment'
import { Book } from '../entity/book.entity'
import { registerInput, LoginInput } from './inputs.resolver'

@ObjectType()
class LoginResponse{

    @Field()
    userId !: Number;

    @Field()
    jwt !: String;

}





@Resolver()
export class UserResolver{

    userRepository: Repository<User>;
    bookRepository: Repository<Book>;

    constructor(){
        this.userRepository = getRepository(User);
        this.bookRepository  = getRepository(Book);
    }

    @Mutation(()=>User)
    async register( @Arg("input", ()=>registerInput) input: registerInput): Promise <User | undefined>{
        
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


    @Mutation( () => LoginResponse)
    async login( @Arg("input", ()=> LoginInput) input: LoginInput): Promise <LoginResponse>
    {

        try{
            const { email, password} = input;
            const userFound = await this.userRepository.findOne({ where: {email} });
            if(!userFound){
                const error= new Error("Invalid credentials"); 
                throw error;
            }

            const isValidPasword: boolean = compareSync( password, userFound.password);
            if(!isValidPasword){
                const error= new Error("Invalid credentials");  
                throw error;
            }

            const newJwt: string = sign ({id: userFound.id}, environment.JWT_SECRET);
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