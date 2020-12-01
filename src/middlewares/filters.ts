import * as Koa from 'koa';
import HttpStatusCodes from 'http-status-codes';
import uuidv1 from 'uuid/v1';

import { Validators } from '../utils/validators';
import { JsonWebToken } from '../utils/jwt';

import { logger } from '../app/logger';

/*
 * Authorization Filter
 */
export async function authorizationFilter(ctx: Koa.Context, next: any) {

  if (process.env.AUTH_DISABLED !== 'yes') {
    const route = ctx.request.method + ctx.request.path;
    const auth = ctx.headers.authorization as string;
    logger.info(`Check for authorization in request ${ctx.state.request_id} for route ${route}`);

    if (Validators.strIsBlank(auth) || !Validators.isBearerToken(auth)) {
      ctx.throw(HttpStatusCodes.UNAUTHORIZED, 'Bearer token was not found.');
    }

    try {
      JsonWebToken.verifyJwt(process.env.JWT_SECRET, auth.substring(7, auth.length));
    } catch (err) {
      ctx.throw(HttpStatusCodes.UNAUTHORIZED, err.message);
    }

    // set security context
    ctx.state = { ...ctx.state, user: 'Authorized', credentials: auth, loggedOn: true };
  }

  await next();
}

/*
 * An ingress filter that catches errors
 */
export async function requestHandler(ctx: Koa.Context, next: any) {

  // generate unique ID for request
  ctx.state.request_id = uuidv1() as string;

  // log request
  let msg = `[${new Date().toLocaleString()}] ` +
    `request: ${ctx.state.request_id } ` +
    `is a ${ctx.request.method} for path ${ctx.request.path}`;
  logger.info(msg);

  // try - catch and handle error in catch
  try {
    await next();
  } catch (err) {
    ctx.app.emit('error', err, ctx);
  }

  // log response
  msg = `[${new Date().toLocaleString()}] ` +
    `response for request: ${ctx.state.request_id} has status ${ctx.status}`;
  logger.info(msg);
}

/*
 * A costum error handler
 */
export async function errorHandler(err: any, ctx: Koa.Context) {

  logger.error(
    `${err.status || ctx.status} with error '${err}' on request with id ${ctx.state.request_id}`);
  logger.debug(err);
  ctx.body = {
    status: err.status || ctx.status || HttpStatusCodes.INTERNAL_SERVER_ERROR,
    cause: err.name,
    message: err.message,
    path: ctx.request.path,
    time: new Date().getTime(),
  };

  ctx.status = err.status || ctx.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;
  if (ctx.status === HttpStatusCodes.OK) {
    ctx.status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    ctx.body.status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  }
}
