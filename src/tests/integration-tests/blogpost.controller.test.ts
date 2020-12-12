import chai from 'chai';
import chai_http from 'chai-http';
import 'mocha';

import HttpStatus from 'http-status-codes';
import Server from '../../server';

describe('Integration test against blogpost controller', () => {
  chai.use(chai_http);

  /* ==== entities ==== */
  const app = new Server();

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

  /* ==== absorved ==== */
  const created = { id: '' };

  /* ==== before and after ==== */
  before(async () => {
    await app.start('.env.test', true);
  });

  after(async () => {
    await app.clearDB();
    await app.stop();
  });

  /*
   * the tests proper
   */
  it('returns an empty list when fecthing blogposts', async () => {

    const response = await chai.request(app.asServer()).get(prefix);

    chai.expect(response).to.have.status(HttpStatus.OK);
    chai.expect(response.body).to.be.not.null;
    chai.expect(response.body).to.be.an('array');
  });

  it('returns 404 when fetching a blogpost with a non-existent id', async () => {

    const response = await chai.request(app.asServer()).get(`${prefix}/41224d776a326fb40f000001`);

    chai.expect(response).to.have.status(HttpStatus.NOT_FOUND);
  });

  it('creates a blogpost and responds with a 201 CREATED HTTP status code', async () => {

    const response = await chai.request(app.asServer())
      .post(prefix)
      .set('Content-type', 'application/json')
      .send(blogpost);

    chai.expect(response).to.have.status(HttpStatus.CREATED);
    chai.expect(response.body).to.be.not.null;
    chai.expect(response.body.tags).to.be.an('array');
    chai.expect(response.body.author).to.equal('Author');
    chai.expect(response.body.title).to.equal('Title');
    chai.expect(response.body.title).to.equal('Title');
    chai.expect(response.body.lines).to.be.not.null;
    chai.expect(response.body.readTime).to.be.not.null;
    chai.expect(response.body.lines).to.be.gte(2);

    created.id = response.body._id;
  });

  context('After a blogpost is created', () => {

    it('lists that blogpost when fecthing blogposts', async () => {

      const response = await  chai.request(app.asServer()).get(prefix);

      chai.expect(response).to.have.status(HttpStatus.OK);
      chai.expect(response.body).to.be.not.null;
      chai.expect(response.body).to.be.an('array');
      chai.expect(response.body).to.be.an('array').with.length.gte(1);
    });

    it('fetches that particular blogpost when fetching with its id', async () => {

      const response = await  chai.request(app.asServer()).get(`${prefix}/${created.id}`);

      chai.expect(response).to.have.status(HttpStatus.OK);
      chai.expect(response.body).to.be.not.null;
      chai.expect(response.body._id).to.equal(created.id);
      chai.expect(response.body.title).to.equal(blogpost.title);
    });

    it('deletes that blogpost using its id', async () => {

      const response = await  chai.request(app.asServer()).delete(`${prefix}/${created.id}`);

      chai.expect(response).to.have.status(HttpStatus.NO_CONTENT);
    });

    context('After the blogpost was deleted', () => {
      it('does not find any blogpost with its id', async () => {

        const response = await chai.request(app.asServer()).get(`${prefix}/${created.id}`);

        chai.expect(response).to.have.status(HttpStatus.NOT_FOUND);
      });
    });
  });

  it('returns 404 status code when deleting a blogpost with a non-existent id', async () => {

    const response = await chai.request(app.asServer())
      .delete(`${prefix}/41224d776a326fb40f000001`);

    chai.expect(response).to.have.status(HttpStatus.NOT_FOUND);
  });
});
