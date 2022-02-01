import {getRepository, Repository, MoreThan} from 'typeorm' 
import { adminAccount } from '../config/mailer';
import { Loan } from '../entity/loan.entity';
import { sendEmail } from './mailer.admin';
import cron from 'node-cron'
import { LoanResolver } from '../resolvers/loan.resolver';

export const timeLimit: number = 604800000; //una semana en milisegundos

//aplicamos el patron singleton para unica instancia 
export class Administrator{
    
    // Static property to store an instance
    private static instance: Administrator;
    protected alertMenssage: string;

    //Cnstructor is private
    private constructor(){ 
        this.alertMenssage = "exceeding the delivery limits, you will have to pay a FINE";
    }
    
    // Static method to retreive the singleton instance
    public static getInstance(): Administrator {
        if (!this.instance) {
            this.instance = new Administrator();
        }

        return this.instance;
    }

    //metodos
    start(loanRepository: Repository<Loan>){

        const dateWeek = "30 9 * * 1" ;//A las 9:30 de la mañana solo los lunes.
        const everyDay =  "30 10 * * *";//A las 10:30 de la mañana cada dia
        cron.schedule( dateWeek , ()=> this.logger(loanRepository));
        cron.schedule( everyDay , ()=> this.checking(loanRepository));
    }

    private async checking(loanRepository: Repository<Loan>){

        const weeken: number = Number(Date.now()) - timeLimit;
        const backwardUser = await loanRepository.find({dateLoad:MoreThan(weeken)});
        backwardUser.forEach(user => { 
            sendEmail(user.holder.email, this.alertMenssage);
        });  
    }

    private async logger(loanRepository: Repository<Loan>){
        const weeken: number = Number(Date.now()) - timeLimit;
        const backwardUser = await loanRepository.find();
        //const Resume = backwardUser.toString();
        const Resume = backwardUser.join();
        sendEmail(adminAccount.email,Resume);
    }
}

