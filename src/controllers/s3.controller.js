const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { s3Services } = require("../services");
//const { redisClient } = require("../config/redis");

const getBucketList = async (req, res) => {
  const bucketList = await s3Services.getS3BucketList();
  if (bucketList) {
    res.status(201).send({ bucketList });
  } else {
    res.status(500).send("Not Found");
  }
};

// const getS3Data = async (req, res) => {
//   let isCached = false;
//   let results;
//   //await redisClient.del("bucketList")
//   try {
//     //await redisClient.del("bucketList")
//     const cacheResults = await redisClient.get("bucketList");
//     console.log(cacheResults);
//     if (cacheResults) {
//       isCached = true;
//       results = JSON.parse(cacheResults);
//     } else {
//       results = await s3Services.getS3Data(req.params.accountId);
//       if (results.length === 0) {
//         throw "API returned an empty array";
//       }
//       await redisClient.set("bucketList", JSON.stringify(results));
//       //await redisClient.expire("bucketList", 3600); //1 hour
//     }

//     res.status(201).send({
//       fromCache: isCached,
//       data: results,
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

const getS3Data = async (req, res) => {
  const data = await s3Services.getS3Data(req.params.accountId);
  res.status(200).send({ data: data });
};



module.exports = { getBucketList, getS3Data };
