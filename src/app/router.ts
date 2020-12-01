import { SwaggerRouter } from 'koa-swagger-decorator';

import { MetricsController } from '../controllers/metrics.controller';
import { IndexController } from '../controllers/index.controller';
import { UserController } from '../controllers/user.controller';
import { BlogPostController } from '../controllers/blogpost.controller';
import { CommentsController } from '../controllers/comments.controller';
import { NotificationsController } from '../controllers/notifications.controller';
import { AuthenticationController } from '../controllers/auth.controller';

/*
 * Import all controller defined routes in a single place
 */

// SwaggerRouter extends Router
const swaggerRouter: SwaggerRouter = new SwaggerRouter();

swaggerRouter.swagger({
  title: 'Journal-API',
  description: 'An API to create and maintain my own personal blog',
  version: '1.0.0',

  swaggerHtmlEndpoint: '/swagger-html',
  swaggerJsonEndpoint: '/swagger-json',

  swaggerConfiguration: {
    display: {
      defaultModelsExpandDepth: 4,
      defaultModelExpandDepth: 3,
      docExpansion: 'list',
      defaultModelRendering: 'model',
    },
  },
});

swaggerRouter
  .use(new MetricsController().endpoints())
  .use(new IndexController().endpoints())
  .use(new UserController().endpoints())
  .use(new BlogPostController().endpoints())
  .use(new CommentsController().endpoints())
  .use(new NotificationsController().endpoints())
  .use(new AuthenticationController().endpoints());

swaggerRouter.mapDir(`${__dirname}../controllers`);

export default swaggerRouter;
