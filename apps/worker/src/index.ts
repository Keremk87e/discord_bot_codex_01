import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '@packages/config';
import { logger } from '@packages/logger';

const connection = new IORedis(config.REDIS_URL, { maxRetriesPerRequest: null });
const queue = new Queue('platform-jobs', { connection, prefix: config.QUEUE_PREFIX });

new Worker('platform-jobs', async (job) => {
  logger.info({ job: job.name }, 'worker_job_received');
}, { connection, concurrency: config.WORKER_CONCURRENCY, prefix: config.QUEUE_PREFIX });

await queue.add('analytics-aggregation', { scope: 'daily' }, { repeat: { pattern: '0 * * * *' } });
await queue.add('cleanup', { kind: 'ticket-transcript' });
await queue.add('unmute-placeholder', {});
await queue.add('unban-placeholder', {});
logger.info('worker_started');
