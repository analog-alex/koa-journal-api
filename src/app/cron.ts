import cron from 'node-cron';

export default class CronJobs {

  private jobs: cron.ScheduledTask[] = [];

  public start() {
    // no jobs are yet needed
    this.jobs.forEach(job => job.start());
  }

  public stop() {
    this.jobs.forEach(job => job.stop());
  }
}
