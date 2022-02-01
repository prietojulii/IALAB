import {GmailAcount, transporter, adminAccount} from '../config/mailer'

export async function sendEmail(userAccount:string, menssage: string){

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: " Librery <"+adminAccount.email+">", // sender address
    to:     userAccount, // list of receivers
    subject: "FINE ALERT! ", // Subject line
    text: menssage, // plain text body
    //html: "<b>Hello world?</b>", // html body
  });
}


/**
 * var CronJob = require('cron').CronJob;
var job = new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
job.start();
 */