import { ObjectType, Field } from 'type-graphql';
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from 'typeorm';


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
}