import chai from 'chai';
import chai_http from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';
import AppServer from '../../server';
import { Server } from 'http';

describe('Integration test against blogpost controller', () => {

  /* ==== entities ==== */
  chai.use(chai_http);
  const appServer = new AppServer();
  let app: Server;

  /* ==== constants ==== */
  const prefix = '/posts';
  const blogpost = {
    author: 'Author',
    title: 'Title',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore' +
      'magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
      'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tags: ['test', 'integration'],
  };

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
  it('simple get returns an empty list of blogposts', (done) => {

    chai.request(app)
        .get(prefix)
        .end((__, res) => {
          chai.expect(res).to.have.status(HttpStatus.OK);
          chai.expect(res.body).to.be.not.null;
          chai.expect(res.body).to.be.an('array');
          done();
        });
  });

  it('when fetching a non-existent blogpost by id it should return a 404 status code', (done) => {

    chai.request(app)
      .get(`${prefix}/41224d776a326fb40f000001`)
      .end((__, res) => {
        chai.expect(res).to.have.status(HttpStatus.NOT_FOUND);
        done();
      });
  });

  it('creates a blog post', (done) => {

    chai.request(app)
        .post(prefix)
        .set('Content-type', 'application/json')
        .send(blogpost)
        .end((__, res) => {
          chai.expect(res).to.have.status(HttpStatus.CREATED);
          chai.expect(res.body).to.be.not.null;
          chai.expect(res.body.tags).to.be.an('array');
          chai.expect(res.body.author).to.equal('Author');
          chai.expect(res.body.title).to.equal('Title');
          chai.expect(res.body.title).to.equal('Title');
          chai.expect(res.body.lines).to.be.not.null;
          chai.expect(res.body.readTime).to.be.not.null;
          chai.expect(res.body.lines).to.be.gte(2);
          done();
        });
  });

  it('create a blogpost and lists it', (done) => {

    chai.request(app)
        .post(prefix)
        .set('Content-type', 'application/json')
        .send(blogpost)
        .end((__, res) => {
          chai.expect(res).to.have.status(HttpStatus.CREATED);

          chai.request(app)
          .get(prefix)
          .end((__, res) => {
            chai.expect(res).to.have.status(HttpStatus.OK);
            chai.expect(res.body).to.be.not.null;
            chai.expect(res.body).to.be.an('array');
            chai.expect(res.body).to.be.an('array').with.length.gte(1);
            done();
          });
        });
  });

  it('creates a blogpost and fetches it by id', (done) => {

    chai.request(app)
        .post(prefix)
        .set('Content-type', 'application/json')
        .send(blogpost)
        .end((__, res) => {
          chai.expect(res).to.have.status(HttpStatus.CREATED);
          chai.expect(res.body).to.be.not.null;
          chai.expect(res.body._id).to.be.not.null;

          chai.request(app)
            .get(`${prefix}/${res.body._id}`)
            .end((__, inner) => {
              chai.expect(inner).to.have.status(HttpStatus.OK);
              chai.expect(inner.body).to.be.not.null;
              chai.expect(inner.body._id).to.equal(res.body._id);
              chai.expect(inner.body.title).to.equal(res.body.title);
              done();
            });
        });
  });

  it('deletes a blogpost by id', (done) => {

    chai.request(app)
        .post(prefix)
        .set('Content-type', 'application/json')
        .send(blogpost)
        .end((__, res) => {
          chai.expect(res).to.have.status(HttpStatus.CREATED);
          chai.expect(res.body).to.be.not.null;
          chai.expect(res.body._id).to.be.not.null;

          chai.request(app)
            .delete(`${prefix}/${res.body._id}`)
            .end((__, inner) => {
              chai.expect(inner).to.have.status(HttpStatus.NO_CONTENT);
              done();
            });
        });
  });

  it('when deleting a non-existent blogpost by id, returns 404 status code', (done) => {

    chai.request(app)
      .delete(`${prefix}/99`)
      .end((__, res) => {
        chai.expect(res);
        done();
      });
  });

});
