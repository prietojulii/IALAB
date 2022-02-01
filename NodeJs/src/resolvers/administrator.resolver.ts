import {getRepository, Repository} from 'typeorm' 
import {configureAdmin} from '../config/mailer';
import {Administrator} from '../admin/administrator.admin';
import {Mutation, Resolver, Arg, UseMiddleware, Query} from 'type-graphql';
import { Loan } from '../entity/loan.entity';
import { registerInput } from './inputs.resolver';
import {Admin} from "../entity/admin.entity"
import { hash } from 'bcryptjs';
import { isAdmin } from '../middlewares/user.middlewares';



@Resolver() 
export class AdminResolver{
    
    private static existInstance: boolean = false;
    loanRepository: Repository<Loan>;
    adminRepository: Repository<Admin>;

    constructor(){
        this.loanRepository = getRepository(Loan);
        this.adminRepository = getRepository(Admin)
        
    };

    @Query(()=>Boolean)
    @UseMiddleware(isAdmin) 
    initAdministrator(){
        try{     
            if(!AdminResolver.existInstance){
                try{
                    configureAdmin();
                    const admin = Administrator.getInstance();
                    admin.start(this.loanRepository);
                }catch(e: any){
                    const error = new Error("Failed to generate administrator instance");
                    throw error;
                }
                AdminResolver.existInstance = true;
            }else{
               alert("messaging system is already active");

            }
            return AdminResolver.existInstance;
        }catch(e: any){
            throw new Error(e.message);
        }
    };


    

//TODO:CAMBIAR GMAIL CUENTA DE EMPRESA, SOLICITAR REGISTROS, ETC



}
