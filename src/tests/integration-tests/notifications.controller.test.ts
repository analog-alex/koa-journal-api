import chai from 'chai';
import chai_http from 'chai-http';
import 'mocha';
import HttpStatus from 'http-status-codes';
import Server from '../../server';

describe('Integration test against nofifications controller', function () {
  this.timeout(5000);

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

  it.skip('sms endpoint correctly sends a text message to the designated number', async () => {
    const response = await chai.request(app.asServer())
      .post('/notifications/sms')
      .set('content-type', 'application/json')
      .send({ to: process.env.TEST_SMS_TO, message: 'This is an integration test' });

    chai.expect(response).to.have.status(HttpStatus.NO_CONTENT);
  });
});
