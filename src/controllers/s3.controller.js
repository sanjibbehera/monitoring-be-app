const { s3Services } = require("../services");
const { redisClient } = require("../config/redis");

const getBucketList = async (req, res) => {
  const bucketList = await s3Services.getS3BucketList();
  if (bucketList) {
    res.status(201).send({ bucketList });
  } else {
    res.status(500).send("Not Found");
  }
};

const getS3Data = async (req, res) => {
  let isCached = false;
  let results;

  try {
    let cacheResults;
    try {
      // Add a timeout for the Redis operation
      cacheResults = await Promise.race([
        redisClient.get("bucketList"),
        new Promise((resolve, reject) => {
          setTimeout(
            () => reject(new Error("Redis operation timed out")),
            1000
          ); // Adjust timeout as needed
        }),
      ]);
      console.log(cacheResults);
    } catch (redisError) {
      console.error("Error connecting to Redis:", redisError.message);
    }

    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await s3Services.getS3Data(req.params.accountId);
      if (results.length === 0) {
        throw "API returned an empty array";
      }

      // If Redis is unavailable, skip caching and log a message
      console.log("Redis server unavailable. Skipping caching.");
    }

    res.status(201).send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// const getS3Data = async (req, res) => {
//   const data = await s3Services.getS3Data(req.params.accountId);
//   res.status(200).send({ data: data });
// };

module.exports = { getBucketList, getS3Data };
