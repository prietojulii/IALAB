import {InputType, Field} from 'type-graphql';

import {Length, IsEmail} from 'class-validator';
//Inputs:
  //"!" -> obligatorio
  //"?" -> opcionales

@InputType()
export class registerInput{

    @Field()
    @Length(3,64)
    fullName!: string

    @Field()
    @IsEmail()
    email!: string
    
    @Field()
    @Length(8,254)
    password!: string


}

@InputType()
export class LoginInput{

    @Field()
    @IsEmail()
    email!: string
    
    @Field()
    @Length(8,254)
    password!: string
}


@InputType()
export class BookIdInput{

    @Field( ()=> Number)
    id !: number
} 

@InputType()
export class BookInput{
    
    @Field()
    @Length(3,64)
    title !: string;
    
    @Field() 
    author !: number;
}

@InputType()
export class BookUpdateInput{ 

    @Field( ()=> String, {nullable: true})
    @Length(3,64)
    title ?: string;

    @Field(()=> Number, {nullable:true}) 
    author ?: number;

}


@InputType()
export class AuthorInput{

    @Field()
    @Length(3,64)
    fullName !: string
} 

@InputType()
export class AuthorUpdateInput{

    @Field( ()=> Number)
    id !: number //obligatorio

    @Field()
    @Length(3,64)
    fullName ?: string //opcional
} 

@InputType()
export class AuthorIdInput{

    @Field( ()=> Number)
    id !: number
} 