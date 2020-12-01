import cron from 'node-cron';
import { logger } from './logger';

export default class CronJobs {

  private jobs: cron.ScheduledTask[] = [];

  public start() {
    this.jobs.push(
      cron.schedule('*/2 * * * *', () => {
        logger.info('running a task every 2 minutes');
      }),
    );

    this.jobs.forEach(job => job.start());
  }

  public stop() {
    this.jobs.forEach(job => job.stop());
  }
}
