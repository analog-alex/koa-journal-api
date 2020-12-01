import ratelimit from 'koa-ratelimit';

const db = new Map();

export default ratelimit({
  db,
  driver: 'memory',
  duration: 60000,
  errorMessage: 'Too many requests.',
  id: ctx => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total',
  },
  max: 100,
  disableHeader: false,
});
