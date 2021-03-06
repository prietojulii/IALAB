import { ObjectType, Field } from 'type-graphql';
import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn,OneToOne} from 'typeorm';
import { Author } from './author.entity';
import { Loan } from './loan.entity';

@ObjectType()
@Entity() //decriptor para que extienda de la clase entity y de esta forma typeormlo reconoce como entidad
export class Book{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    title!: string
    
    @Field(() => Author)
    @ManyToOne(() => Author, author => author.books, { onDelete: 'CASCADE' })
    author!: Author
    
    @Field()
    @CreateDateColumn({type: 'timestamp'})
    createdAt!: string
 
    @Field(()=> Loan, {nullable: true})
    @OneToOne(()=> Loan,loan => loan.book , {nullable: true})
    @JoinColumn()
    loan !: Loan; //prestamo asociado
}
/*
. El signo de exclamación le dice al lector del código: ESTO NO PUEDE SER NULO (undefined)
Ese es el operador de aserción no nula (!). Es una forma de decirle al compilador "esta expresión no 
puede ser nullo undefinedaquí, así que no se queje de la posibilidad de que sea nullo undefined


. Mientras ?dice: esto podría ser null.


Intalar:
npm i class-validator 

*/