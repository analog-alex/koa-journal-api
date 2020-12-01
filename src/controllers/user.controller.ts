import Koa from 'koa';
import HttpStatusCodes from 'http-status-codes';
import { Middleware } from 'koa-compose';
import bcrypt from 'bcrypt';

import User from '../models/user.model';
import { SwaggerRouter, request, summary, path, body, responsesAll, tagsAll } from 'koa-swagger-decorator';

import { authorizationFilter } from '../middlewares/filters';

/* *
 * Method implementations
 */
@responsesAll({
  200: { description: 'Success' },
  400: { description: 'Bad Request' },
  401: { description: 'Unauthorized' },
})
@tagsAll(['User'])
export class UserController {

  /* ==== router object ==== */
  private router: SwaggerRouter = new SwaggerRouter({ prefix: '/users' });

  /* ==== match the endpoints to the methods ==== */
  constructor() {

    this.router
      .get('/', authorizationFilter, this.getAll)
      .get('/search', authorizationFilter, this.search)
      .get('/:id', authorizationFilter, this.getById)
      .post('/', authorizationFilter, this.create)
      .patch('/:id', authorizationFilter, this.update)
      .delete('/:id', authorizationFilter, this.delete);
  }

  /* ==== access the router ==== */
  public getRouter(): SwaggerRouter {
    return this.router;
  }

  public endpoints(): Middleware<Koa.ParameterizedContext> {
    return this.router.routes();
  }

  /* ==== the asynchronous methods ==== */

  /*
   * GET => []
   */
  @request('get', '/users')
  @summary('Find all users')
  public async getAll(ctx: Koa.Context) {

    ctx.body = await User.find().exec();
  }

  /*
   * GET => {}
   */
  @request('get', '/users/{id}')
  @summary('Find a user by id')
  @path({
    id: { type: 'number', required: true, description: 'User\'s Id' },
  })
  public async getById(ctx: Koa.Context) {

    ctx.body = await User.findById(ctx.params.id).exec();
  }

  /*
   * GET => []
   */
  @request('get', '/users/search')
  @summary('Search a user by attributes')
  public async search(ctx: Koa.Context) {

    const params = {
      username: ctx.request.query.username,
    };

    ctx.body = await User.find(params).populate('User', '-password').exec();
  }

  /*
   * POST => new {}
   */
  @request('post', '/users')
  @summary('Create a user')
  @body(User)
  public async create(ctx: Koa.Context) {

    const user = new User(ctx.request.body);
    user.createdAt = new Date();

    // run validations
    const validation: Error = user.validateSync();
    if (validation !== undefined) {
      ctx.throw(HttpStatusCodes.BAD_REQUEST, validation);
    }

    // hash password with bcrypt
    user.password = await bcrypt.hash(
      user.password, parseInt(process.env.SALT_ROUNDS, 10));

    // save
    ctx.body = await user.save();
    ctx.status = HttpStatusCodes.CREATED;
  }

  /*
   * PATCH => update {}
   */
  @request('patch', '/users/{id}')
  @summary('Patch a user')
  @path({
    id: { type: 'number', required: true, description: 'User\'s Id' },
  })
  @body(User)
  public async update(ctx: Koa.Context) {

    await User.findByIdAndUpdate({ _id: ctx.params.id }, ctx.request.body).exec();

    ctx.status = HttpStatusCodes.NO_CONTENT;
  }

  /*
   * DELETE => delete {}
   */
  @request('delete', '/users/{id}')
  @summary('Delete a user')
  @path({
    id: { type: 'number', required: true, description: 'User\'s Id' },
  })
  public async delete(ctx: Koa.Context) {

    await User.deleteOne({ _id: ctx.params.id }).exec();

    ctx.status = HttpStatusCodes.NO_CONTENT;
  }
}
