import chai from 'chai';
import chai_http from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';
import Server from '../../server';

describe('Integration test against comments controller', () => {

  /* ==== entities ==== */
  chai.use(chai_http);
  const app = new Server();

  /* ==== constants ==== */
  const blogpost = { author: 'Author', title: 'Title', text: 'Test', tags: ['owo'] };
  const comments = { author: 'Commenter', text: 'Comment' };

  let post: any = undefined;

  /* ==== before and after ==== */
  before(async () => {
    await app.start('.env.test', true);
    post = await chai.request(app.asServer())
        .post('/posts')
        .set('Content-type', 'application/json')
        .send(blogpost);
  });

  after(async () => {
    await app.clearDB();
    await app.stop();
  });

  /*
   * the tests proper
   */
  context('when creating a comment', () => {

    it('returns 201 Created', async () => {

      const response = await chai.request(app.asServer())
        .post(`/posts/${post.body._id}/comments`)
        .set('Content-type', 'application/json')
        .send(comments);

      chai.expect(response).to.have.status(HttpStatus.CREATED);
    });

    it('is findable via a get request', async () => {
      const response = await chai.request(app.asServer())
        .get(`/posts/${post.body._id}/comments`)
        .send(comments);

      chai.expect(response).to.have.status(HttpStatus.OK);
      chai.expect(response.body).to.be.not.null;
      chai.expect(response.body).to.be.an('array').with.length.gt(0);
    });
  });
});
