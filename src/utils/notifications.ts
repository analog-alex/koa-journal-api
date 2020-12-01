import { Twilio } from 'twilio';
import { logger } from '../app/logger';

let twilio: Twilio;

const setUpTwilio = () => twilio = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const sendSms = async (message: string, to: string, extention: string = '+351') => {

  const body = {
    body: message,
    from: process.env.TWILIO_FROM,
    to: extention + to,
  };

  await twilio.messages.create(body)
    .then(message => logger.info(`SMS sent with sid ${message.sid}`));
};

export { setUpTwilio, sendSms };
