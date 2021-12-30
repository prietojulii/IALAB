import { ObjectType, Field } from 'type-graphql';
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany} from 'typeorm'; 
import { Loan } from './loan.entity';
@ObjectType()
@Entity() //decriptor para que extienda de la clase entity y de esta forma typeormlo reconoce como entidad
export class User{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    fullName!: string


    @Field()
    @Column()
    email!: string
    
    @Field()
    @Column()
    password!: string


    @Field()
    @CreateDateColumn({type: 'timestamp'})
    createdAt!: string

    @Field(()=> [Loan], {nullable: true})
    @OneToMany(()=> Loan,loans => loans.holder, {nullable: true} )
    loans !: Loan[];
}