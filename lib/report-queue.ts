import { Queue } from "bullmq";
import IORedis from "ioredis";

export const REPORT_QUEUE = "reports";

/** BullMQ needs maxRetriesPerRequest: null on its connections. */
export function redisConnection() {
  return new IORedis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379", { maxRetriesPerRequest: null });
}

let queue: Queue | undefined;
export function reportQueue() {
  queue ??= new Queue(REPORT_QUEUE, {
    connection: redisConnection(),
    defaultJobOptions: { attempts: 2, backoff: { type: "fixed", delay: 3000 }, removeOnComplete: 200, removeOnFail: 200 },
  });
  return queue;
}
