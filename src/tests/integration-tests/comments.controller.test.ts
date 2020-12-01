import chai from 'chai';
import chai_http from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';
import AppServer from '../../server';
import { Server } from 'http';

describe('Integration test against comments controller', () => {

  /* ==== entities ==== */
  chai.use(chai_http);
  const appServer = new AppServer();
  let app: Server;

  /* ==== constants ==== */
  const blogpost = { author: 'Author', title: 'Title', text: 'Test', tags: ['owo'] };
  const comments = { author: 'Commenter', text: 'Comment' };

  /* ==== before and after ==== */
  before(async () => {
    app = await appServer.start('.env.test', true);
  });

  after(async () => {
    const promise = appServer.stop();
    app.close();
    await promise;
  });

  /*
   * the tests proper
   */
  it.skip('when creating a comment, it returns a 201 status code', (done) => {

    chai.request(app)
        .post('/posts')
        .set('Content-type', 'application/json')
        .send(blogpost)
        .end((__, res) => {

          chai.request(app)
            .post(`/posts/${res.body._id}/comments`)
            .set('Content-type', 'application/json')
            .send(comments)
            .end((__, res) => {
              chai.expect(res).to.have.status(HttpStatus.CREATED);
              done();
            });
        });
  });

});
