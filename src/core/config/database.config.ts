import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv'
import config from './config';

dotenv.config()
const CONFIG = config();

export default registerAs('database', () => {
  switch (process.env.NODE_ENV) {
    case 'staging':
      return {
        dbUrl: CONFIG.DB_LOCAL_URI
      };
    
    case 'production':
      return {
        dbUrl: CONFIG.DB_LOCAL_URI
      };

    default:
      return {
        dbUrl: CONFIG.DB_LOCAL_URI
      };
  }
});
