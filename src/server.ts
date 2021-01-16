import { app } from './app/app';
import { config, DotenvConfigOutput } from 'dotenv';
import { connect, mongoose } from './app/db';
import { setUpTwilio } from './utils/notifications';
import { Server } from 'http';
import { logger, disableLogs } from './app/logger';
import CronJobs from './app/cron';
import { Mongoose } from 'mongoose';

export default class {

  private jobs: CronJobs;
  private db: Mongoose;
  private path: string;
  private httpServer: Server;

  public async start(configPath: string, withDB: boolean): Promise<Server>  {

    this.path = configPath;

    // pick up configuration (dotenv file)
    const configuration: DotenvConfigOutput = config({ path: configPath });
    logger.debug(`Configurations for path ${configPath} loaded: ${configuration.parsed != null}`);
    if (process.env.LOG_REQUESTS !== 'true') {
      logger.debug('Disabling logs (for all log levels)');
      disableLogs();
    }

    // init twillio
    const twilio = setUpTwilio();
    logger.debug('Twilio api is a go!');

    // connect to database
    if (withDB) {
      logger.debug('Connecting to MongoDB...');
      this.db = mongoose;
      await connect();
    }

    // start cron jobs
    this.jobs = new CronJobs();
    this.jobs.start();

    // INGITION
    // launch server
    const PORT: number = Number(process.env.PORT) || 3000;
    this.httpServer = app.listen(PORT, () => {
      logger.info(`Server up, listening on port ${PORT}`);
    });

    return this.httpServer;
  }

  public async stop() {
    this.httpServer.close();
    this.jobs.stop();
    await this.db?.disconnect();
  }

  public async clearDB() {
    if (this.path === '.env.test') {
      this.db.connection.db.dropDatabase((_, res) => logger.debug(`DB dropped: ${res}`));
    }
  }

  public asServer(): Server {
    return this.httpServer;
  }
}
