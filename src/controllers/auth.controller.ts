import Koa from 'koa';
import Router from 'koa-router';
import { Middleware } from 'koa-compose';
import bcrypt from 'bcrypt';

import User from '../models/user.model';
import Otp from '../models/otp.models';
import HttpStatusCodes from 'http-status-codes';
import { Validators } from '../utils/validators';
import { JsonWebToken } from '../utils/jwt';
import { sendSms } from '../utils/notifications';
import generateCodeOfLength from '../utils/otp-generator';

interface UserDetails {
  username: string;
  password: string;
}

interface OtpDetails {
  otp: string;
  hashId: string;
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
      .post('/login', this.login)
      .post('/otp', this.otp);
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
      const code = generateCodeOfLength(6);

      await Otp.findOneAndUpdate(
        { _id: user._id },
        { otp: `${code}`, createdAt: new Date() },
        { upsert: true },
      ).exec();

      ctx.body = { id: user.id, generated: true };
      await sendSms(`Auth code for login in BLOG is ${code}`, process.env.TWILIO_TO);

    } else {
      ctx.throw(HttpStatusCodes.UNAUTHORIZED, 'Invalid Password');
    }
  }

  public async otp(ctx: Koa.Context) {

    const { otp, hashId }: OtpDetails = ctx.request.body;

    const hashPass = await Otp.findById(hashId).exec();

    if (hashPass == null) {
      ctx.throw(HttpStatusCodes.UNAUTHORIZED, 'OTP not found');
    }

    if (hashPass.otp !== otp) {
      ctx.throw(HttpStatusCodes.UNAUTHORIZED, 'OTP not found');
    }

    if (new Date().getTime() - hashPass.createdAt.getTime() > 300_000) {
      ctx.throw(HttpStatusCodes.UNAUTHORIZED, 'OTP has expired');
    }

    // it is valid!
    // delete the OTP from the database and return a valid token
    await Otp.deleteOne({ _id: hashId }).exec();

    ctx.body = {
      jwt: JsonWebToken.signJwt(
            process.env.JWT_SECRET,
            process.env.JWT_EXP_MINUTES as unknown as number),
    };
  }
}
