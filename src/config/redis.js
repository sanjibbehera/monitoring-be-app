const redis = require("redis");

let redisClient;
let isConnected = false;

(async () => {
  try {
    redisClient = redis.createClient();

    redisClient.on("error", (error) => {
      if (!isConnected) {
        console.error(`Error connecting to Redis: ${error}`);
        isConnected = true;
      }
    });

    await redisClient.connect();
  } catch (error) {
    console.error("Error connecting to Redis:", error.message);
  }
})();

module.exports = {
  redisClient,
};
