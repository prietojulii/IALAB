import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

//Variables globales
export var adminAccount: GmailAcount;
export var transporter:nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

//Clases
export class GmailAcount{
  email: string ;
  passApp: string ;

  constructor(email?:string, passApp?:string){
      this.email = email || "romi.2145.chichi@gmail.com";
      this.passApp = passApp || "cuanizsapfwjcqdq";
  }

}

//Funciones
export function configureAdmin(){

  //creamos la cuenta de administrador por defecto
  adminAccount =  new GmailAcount();
  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, //coneccion SMTP segura  -> (SSL)
    secure: true, 
    auth: {
      user: adminAccount.email, // generated ethereal user
      pass: adminAccount.passApp, // generated ethereal password
    },
  });

  //verificamos que los campos sean correctos
  if(!transporter.verify()){
      throw new Error("doesnt exist Gmail account for admin")
  }
}
