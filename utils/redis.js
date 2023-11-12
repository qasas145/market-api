// const Redis = require('ioredis');
const redis = require('redis')
const { StatusCodes } = require('http-status-codes');

const HttpError = require('./HttpError');

require('dotenv').config();
// const REDIS_PASSWORD = process.env.REDIS_SECRET_PASS;
const REDIS_PASSWORD = '';

// const redisClient = new Redis({
//   password: REDIS_PASSWORD,
//   host: 'redis-6380.c135.eu-central-1-1.ec2.cloud.redislabs.com',
//   port: 6380
// });

const redisClient = redis.createClient();

redisClient.on('error', (error) => {
  console.log(`Redis error: ${error}`);
  throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Redis Error');
});




(async () => { 
  await redisClient.connect(); 
})(); 

redisClient.on("ready", () => { 
  console.log("Connected to redis !"); 
}); 

redisClient.on("error", (err) => { 
  console.log("Error in the Connection"); 
});

const putRedis = async (key, data) =>{
  redisClient.set(JSON.stringify(key), JSON.stringify(data), 'EX', 3600);
}

const getRedis = async (key) => redisClient.get(JSON.stringify(key));

const delRedis = async (key) => redisClient.del(JSON.stringify(key));

const clearRedis = async () => redisClient.flushall();

const keyGenerator = (reqKey) => {
  const sortedKeys = Object.keys(reqKey).sort();

  const sortedKey = {};
  for (const key of sortedKeys) sortedKey[key] = reqKey[key];

  return sortedKey;
};

module.exports = { putRedis, getRedis, delRedis, clearRedis, keyGenerator };
