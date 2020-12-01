import Koa from 'koa';
import Router from 'koa-router';
import HttpStatusCodes from 'http-status-codes';
import { Middleware } from 'koa-compose';

import BlogPost from '../models/post.model';
import Comments, { Comment } from '../models/comments.model';

import { authorizationFilter } from '../middlewares/filters';

/* *
 * Method implementations
 */
export class CommentsController {

  /* ==== router object ==== */
  private router: Router = new Router({ prefix: '/posts/:id/comments' });

  /* ==== match the endpoints to the methods ==== */
  constructor() {

    this.router
      .get('/', this.getAll)
      .get('/:order', this.getByOrder)
      .post('/', this.create)
      .delete('/:order', authorizationFilter, this.delete);
  }

  /* ==== access the router ==== */
  public endpoints(): Middleware<Koa.ParameterizedContext> {
    return this.router.routes();
  }

  /* ==== the asynchronous methods ==== */

  /*
   * GET => []
   */
  public async getAll(ctx: Koa.Context) {

    const container = await Comments.findOne({ blogPostId: ctx.params.id }).exec();
    ctx.status = HttpStatusCodes.OK;
    ctx.body = container?.comments ?? [];
  }

  /*
   * GET => {}
   */
  public async getByOrder(ctx: Koa.Context) {

    const container = await Comments.findOne({ blogPostId: ctx.params.id }).exec();
    const orderToFind: number = parseInt(ctx.params.order, 10);

    ctx.status = HttpStatusCodes.OK;
    ctx.body = container.comments.find(comment => comment.order === orderToFind) ?? {};
  }

  /*
   * POST => new {}
   */
  public async create(ctx: Koa.Context) {

    // is there a post for that id ?
    const blogPost = await BlogPost.findById(ctx.params.id).exec();

    if (blogPost == null) {
      ctx.throw(HttpStatusCodes.BAD_REQUEST, 'No blog post found for that id');
    }

    // build comment object
    const comment: Comment = {
      order: 0,
      author: ctx.request.body.author,
      text: ctx.request.body.text,
      createdAt: new Date(),
      timestamp: new Date().getTime(),
    };

    // is there a comments list for that post?
    let container = await Comments.findOne({ blogPostId: ctx.params.id }).exec();

    if (container == null) {

      container = new Comments();
      container.blogPostId = ctx.params.id;
      comment.order = 1;
      container.comments = [];
      container.comments.push(comment);
    } else {

      comment.order = container.comments.length + 1;
      container.comments.push(comment);
    }

    ctx.body = await container.save();
    ctx.status = HttpStatusCodes.CREATED;
  }

  /*
   * DELETE => delete {}
   */
  public async delete(ctx: Koa.Context) {

    const container = await Comments.findOne({ blogPostId: ctx.params.id }).exec();
    const orderToFilter: number = parseInt(ctx.params.order, 10);

    container.comments = container.comments
      .filter(comment => comment.order !== orderToFilter);

    await container.save();

    ctx.status = HttpStatusCodes.NO_CONTENT;
  }
}
