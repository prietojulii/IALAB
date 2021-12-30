import { ObjectType, Field } from 'type-graphql';
import {Entity,  PrimaryGeneratedColumn, CreateDateColumn, OneToOne,ManyToOne} from 'typeorm';
import { Book } from './book.entity'
import {User} from './user.entity'

@ObjectType()
@Entity() 
export class Loan{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number
    
    @Field(()=> User)
    @ManyToOne(()=> User,holder => holder.loans , { onDelete: 'CASCADE'})
    holder !: User; //Poseedor del libro

    @Field(()=> Book)
    @OneToOne(()=> Book,book => book.loan, { onDelete:'CASCADE'})
    book !: Book;
    
    @Field()
    @CreateDateColumn({type: 'timestamp'})
    DateLoad!: string

} 