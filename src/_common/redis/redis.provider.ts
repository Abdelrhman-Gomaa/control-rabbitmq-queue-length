import IORedis from 'ioredis';

export const RedisProvider = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: () => {
      const redis = new IORedis({
        host: '127.0.0.1', //process.env.REDIS_HOST,
        port: 6379, //+process.env.REDIS_PORT,
        // password: process.env.REDIS_PASS,
        ...(process.env.REDIS_DATABASE_INEDX !== undefined && {
          db: +process.env.REDIS_DATABASE_INEDX
        }),
        maxRetriesPerRequest: null,
        enableReadyCheck: false
      });
      return redis;
    }
  }
];
