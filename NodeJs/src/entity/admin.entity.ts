import { ObjectType, Field } from 'type-graphql';
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany} from 'typeorm';


@ObjectType()
@Entity() //decriptor para que extienda de la clase entity y de esta forma typeormlo reconoce como entidad
export class Admin{
    @Field()
    @PrimaryGeneratedColumn()
    id !: number
    
    @Field(()=> String)
    @Column()
    fullName ?: string = "Admin"

    @Field()
    @Column()
    email!: string
    
    @Field()
    @Column()
    password!: string
    
    @Field(()=>String)
    @CreateDateColumn({type: 'timestamp'})
    createdAt !: string
}