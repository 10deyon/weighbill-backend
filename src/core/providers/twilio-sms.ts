// import { Injectable } from '@nestjs/common';
// import config from '../config/config';
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// const CONFIG = config();

// @Injectable()
// export class TwilioSms {

//     constructor(
//     ) { }

//     async sendSMS(to: string[], message: string) {
//         client.messages
//         .create({
//             username: 'new',
//             body: `${message}`,
//             from: '+15017122661',
//             to
//         })
//         .then(message => console.log(message.sid));
//     }
// }
