import Koa from 'koa';
import Router from 'koa-router';
import { Middleware } from 'koa-compose';

import { readFile } from '../utils/file-utils';

/* *
 * Method implementations
 */
export class IndexController {

  /* ==== router object ==== */
  private router: Router = new Router(/* none */);

  /* ==== match the endpoints to the methods ==== */
  constructor() {

    this.router
      .get('/', this.index)
      .get('/hello', this.hello)
      .get('/error', this.error);
  }

  /* ==== access the router ==== */
  public endpoints(): Middleware<Koa.ParameterizedContext> {
    return this.router.routes();
  }

  /* ==== the asynchronous methods ==== */
  public async index(ctx: Koa.Context) {

    ctx.body = readFile('assets/static/index.html');
  }

  public async hello(ctx: Koa.Context) {

    ctx.body = 'Hello with ❤️ from Miguel';
  }

  public async error(ctx: Koa.Context) {
    ctx.body = 'Oops! Something went wrong.';
  }
}
