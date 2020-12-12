import Koa from 'koa';
import Router from 'koa-router';
import { Middleware } from 'koa-compose';
import { mongoose } from '../app/db';

/* *
 * Method implementations
 */
export class MetricsController {

  /* ==== router object ==== */
  private router: Router = new Router({ prefix: '/metrics' });

  /* ==== match the endpoints to the methods ==== */
  constructor() {

    this.router
      .get('/', this.index)
      .get('/health', this.health)
      .get('/info', this.info);
  }

  /* ==== access the router ==== */
  public endpoints(): Middleware<Koa.ParameterizedContext> {
    return this.router.routes();
  }

  /* ==== the asynchronous methods ==== */
  public async index(ctx: Koa.Context) {

    ctx.body = { endpoints: ['health', 'info'] };
  }

  public async health(ctx: Koa.Context) {

    ctx.body = {
      status: 'UP',
      db: mongoose.connection.readyState,
    };
  }

  public async info(ctx: Koa.Context) {

    ctx.body = {
      version: process.env.VERSION,
      author: process.env.AUTHOR,
      type: process.env.TYPE,
      framework: process.env.FRAMEWORK,
      notes: 'Written with TypeScript',
      datetime: new Date(),
    };
  }
}
