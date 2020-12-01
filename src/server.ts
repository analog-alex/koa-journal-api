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
  db: Mongoose;

  public async start(configPath: string, withDB: boolean): Promise<Server>  {

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
    const server = app.listen(PORT, () => {
      logger.info(`Server up, listening on port ${PORT}`);
    });

    return server;
  }

  public async stop() {
    this.jobs.stop();
    this.db?.disconnect();
  }
}
