import { ObjectType, Field } from 'type-graphql';
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany} from 'typeorm';
import { Book } from './book.entity';


@ObjectType()
@Entity() //decriptor para que extienda de la clase entity y de esta forma typeormlo reconoce como entidad
export class Author{
    @Field()
    @PrimaryGeneratedColumn()
    id !: number
    
    @Field(()=> String)
    @Column()
    fullName !: string 
    
    @Field(() => [Book], { nullable: true })
    @OneToMany(() => Book, book => book.author, { nullable: true })
    books!: Book[]
    
    @Field(()=>String)
    @CreateDateColumn({type: 'timestamp'})
    createdAt !: string
}
/*
. El signo de exclamación le dice al lector del código: ESTO NO PUEDE SER NULO (undefined)
Ese es el operador de aserción no nula (!). Es una forma de decirle al compilador "esta expresión no 
puede ser nullo undefinedaquí, así que no se queje de la posibilidad de que sea nullo undefined
 \!->inicializa

. Mientras ?dice: esto podría ser null.
*/