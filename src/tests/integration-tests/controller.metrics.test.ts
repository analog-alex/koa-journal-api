import chai from 'chai';
import chai_http from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';
import AppServer from '../../server';
import { Server } from 'http';

import CronJobs from '../../app/cron';

describe('Integration test against metrics controller', () => {

  /* ==== entities ==== */
  chai.use(chai_http);
  const appServer = new AppServer();
  let app: Server;

  /* ==== before and after ==== */
  before(async () => {
    app = await appServer.start('.env.test', false);
  });

  after(async () => {
    const promise = appServer.stop();
    app.close();
    await promise;
  });

  /*
   * the tests proper
   */

  it('metrics controller returns available endpoints when pinged at base', (done) => {

    chai.request(app)
        .get('/metrics')
        .end((__, res) => {

          chai.expect(res).to.have.status(HttpStatus.OK);
          chai.expect(res.body.endpoints).to.be.not.null;
          chai.expect(res.body.endpoints).to.be.an('array').that.contains('health', 'info');
          done();
        });
  });

  it('info endpoint correctly responds with information', (done) => {

    chai.request(app)
        .get('/metrics/info')
        .end((__, res) => {

          chai.expect(res).to.have.status(HttpStatus.OK);
          chai.expect(res.body).to.be.not.null;
          chai.expect(res.body.notes).to.equal('Written with TypeScript');
          chai.expect(res.body.framework).to.equal('KoaJS-TESTING ENVIROMENT');
          done();
        });
  });

  it('health endpoint correctly responds with UP', (done) => {

    chai.request(app)
        .get('/metrics/health')
        .end((__, res) => {

          chai.expect(res).to.have.status(HttpStatus.OK);
          chai.expect(res.body).to.be.not.null;
          chai.expect(res.body.status).to.equal('UP');
          done();
        });
  });

});
