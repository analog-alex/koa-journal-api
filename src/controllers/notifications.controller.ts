import Koa from 'koa';
import Router from 'koa-router';
import HttpStatusCodes from 'http-status-codes';
import { Middleware } from 'koa-compose';

import { sendSms } from '../utils/notifications';

/* *
 * Method implementations
 */
export class NotificationsController {

  /* ==== router object ==== */
  private router: Router = new Router({ prefix: '/notifications' });

  /* ==== match the endpoints to the methods, init notifications object ==== */
  constructor() {

    this.router
      .post('/sms', this.sms);
  }

  /* ==== access the router ==== */
  public endpoints(): Middleware<Koa.ParameterizedContext> {
    return this.router.routes();
  }

  /* ==== the asynchronous methods ==== */
  public async sms(ctx: Koa.Context) {

    const { to, message } = ctx.request.body;
    await sendSms(message, to);

    ctx.status = HttpStatusCodes.NO_CONTENT;
  }
}
