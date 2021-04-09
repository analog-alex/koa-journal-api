import chai from 'chai';
import chai_http from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';
import Server from '../../server';

describe('Integration test against metrics controller', () => {

  /* ==== entities ==== */
  chai.use(chai_http);
  const app = new Server();

  /* ==== before and after ==== */
  before(async () => {
    await app.start('.env.test', false);
  });

  after(async () => {
    await app.stop();
  });

  /*
   * the tests proper
   */

  it('metrics controller returns available endpoints when pinged at base', async () => {
    const response = await chai.request(app.asServer()).get('/metrics');

    chai.expect(response).to.have.status(HttpStatus.OK);
    chai.expect(response.body.endpoints).to.be.not.null;
    chai.expect(response.body.endpoints).to.be.an('array').that.contains('health', 'info');

  });

  it('info endpoint correctly responds with information', async () => {
    const response = await chai.request(app.asServer()).get('/metrics/info');

    chai.expect(response).to.have.status(HttpStatus.OK);
    chai.expect(response.body).to.be.not.null;
    chai.expect(response.body.notes).to.equal('Written with TypeScript');
    chai.expect(response.body.framework).to.equal('KoaJS-TESTING ENVIROMENT');

  });

  it('health endpoint correctly responds with UP', async () => {
    const response = await chai.request(app.asServer()).get('/metrics/health');

    chai.expect(response).to.have.status(HttpStatus.OK);
    chai.expect(response.body).to.be.not.null;
    chai.expect(response.body.status).to.equal('UP');
  });
});
