import Koa from 'koa';
import Router from 'koa-router';
import { Middleware } from 'koa-compose';
import bcrypt from 'bcrypt';

import User from '../models/user.model';
import HttpStatusCodes from 'http-status-codes';
import { Validators } from '../utils/validators';
import { JsonWebToken } from '../utils/jwt';

interface UserDetails {
  username: string;
  password: string;
}

/* *
 * Method implementations
 */
export class AuthenticationController {

      /* ==== router object ==== */
  private router: Router = new Router({ prefix: '/auth' });

  /* ==== match the endpoints to the methods, init notifications object ==== */
  constructor() {

    this.router
      .post('/login', this.login);
  }

  /* ==== access the router ==== */
  public endpoints(): Middleware<Koa.ParameterizedContext> {
    return this.router.routes();
  }

  /* ==== the asynchronous methods ==== */
  public async login(ctx: Koa.Context) {

    const { username, password }: UserDetails = ctx.request.body;

    if (Validators.strIsBlank(username) || Validators.strIsBlank(password)) {
      ctx.throw(HttpStatusCodes.BAD_REQUEST, 'No auth information was found in request body');
    }

    const user = await User.findOne({ username }).exec();

    if (user == null) {
      ctx.throw(HttpStatusCodes.UNAUTHORIZED, 'Invalid Username');
    }

    if (await bcrypt.compare(password, user.password)) {

      ctx.body = {
        jwt: JsonWebToken.signJwt(
            process.env.JWT_SECRET,
            process.env.JWT_EXP_MINUTES as unknown as number),
      };
    } else {
      ctx.throw(HttpStatusCodes.UNAUTHORIZED, 'Invalid Password');
    }
  }
}
