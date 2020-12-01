import chai from 'chai';
import chai_http from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';
import AppServer from '../../server';
import { Server } from 'http';

describe('Integration test against nofifications controller', function () {
  this.timeout(5000);

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

  it.skip('sms endpoint correctly sends a text message to the designated number', (done) => {

    chai.request(app)
        .post('/notifications/sms')
        .set('content-type', 'application/json')
        .send({ to: process.env.TEST_SMS_TO, message: 'This is an integration test' })
        .end((__, res) => {

          chai.expect(res).to.have.status(HttpStatus.NO_CONTENT);
          done();
        });
  });
});
