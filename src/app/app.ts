import Koa from 'koa';
import cors from '@koa/cors';
import ratelimit from './rate-limit';
import bodyparser from  'koa-bodyparser';
import router from './router';
import { errorHandler, requestHandler } from '../middlewares/filters';
import 'reflect-metadata';

// init app
const app: Koa = new Koa()
    .use(ratelimit)
    .use(bodyparser())
    .use(cors({ origin: '*' }))
    .use(requestHandler)
    .use(router.routes())
    .on('error', errorHandler);

export { app };
