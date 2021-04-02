import Koa from 'koa';
import Router from 'koa-router';
import HttpStatusCodes from 'http-status-codes';
import { Middleware } from 'koa-compose';
import BlogPost from '../models/post.model';
import { Page, Pageable } from '../models/page.model';

import { TextParse } from '../utils/text-parse';

import { authorizationFilter } from '../middlewares/filters';

/* *
 * Method implementations
 */
export class BlogPostController {

  /* ==== router object ==== */
  private router: Router = new Router({ prefix: '/posts' });

  /* ==== match the endpoints to the methods ==== */
  constructor() {

    this.router
      .get('/', this.getAll)
      .get('/search', this.search)
      .get('/:id', this.getById)
      .post('/', authorizationFilter, this.create)
      .patch('/:id', authorizationFilter, this.update)
      .delete('/:id', authorizationFilter, this.delete);
  }

  /* ==== access the router ==== */
  public endpoints(): Middleware<Koa.ParameterizedContext> {
    return this.router.routes();
  }

  /* ==== the asynchronous methods ==== */

  /*
   * GET (paged) => []
   */
  public async getAll(ctx: Koa.Context) {

    const page = new Page();
    page.index = Number(ctx.query?.index ?? page.index);
    page.size = Number(ctx.query?.size ?? page.size);

    if (page.index < 0 || page.size < 0) {
      ctx.throw(HttpStatusCodes.BAD_REQUEST, 'Page index and/or page size are not in valid range');
    }

    const [results, count] = await Promise.all([
      BlogPost.find().skip(page.size * page.index).limit(page.size).exec(),
      BlogPost.countDocuments().exec(),
    ]);

    page.setCount(count);

    ctx.body = new Pageable(page, results);
  }

  /*
   * GET => {}
   */
  public async getById(ctx: Koa.Context) {

    ctx.body = await BlogPost.findById(ctx.params.id).exec();
    ctx.status = ctx.body ? HttpStatusCodes.OK : HttpStatusCodes.NOT_FOUND;
  }

  /*
   * GET => []
   */
  public async search(ctx: Koa.Context) {

    const params = {
      username: ctx.request.query.username,
    };

    ctx.body = await BlogPost.find(params).exec();
  }

  /*
   * POST => new {}
   */
  public async create(ctx: Koa.Context) {

    const blogPost = new BlogPost(ctx.request.body);
    blogPost.createdAt = new Date();
    blogPost.timestamp = new Date().getTime();

    // text analysis
    const result = TextParse.analyse(blogPost.text);
    blogPost.lines = result.lines;
    blogPost.readTime = result.rating;

    // run validations
    const validation: Error = blogPost.validateSync();
    if (validation !== undefined) {
      ctx.throw(HttpStatusCodes.BAD_REQUEST, validation);
    }

    // save
    ctx.body = await blogPost.save();
    ctx.status = HttpStatusCodes.CREATED;
  }

  /*
   * PATCH => update {}
   */
  public async update(ctx: Koa.Context) {

    const updated =
      await BlogPost.findByIdAndUpdate({ _id: ctx.params.id }, ctx.request.body).exec();
    ctx.status = updated ? HttpStatusCodes.NO_CONTENT : HttpStatusCodes.NOT_FOUND;
  }

  /*
   * DELETE => delete {}
   */
  public async delete(ctx: Koa.Context) {

    const deleted = await BlogPost.deleteOne({ _id: ctx.params.id }).exec();
    ctx.status = deleted.deletedCount > 0 ? HttpStatusCodes.NO_CONTENT : HttpStatusCodes.NOT_FOUND;
  }
}
