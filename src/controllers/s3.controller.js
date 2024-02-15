const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { s3Services } = require("../services");

const getBucketList = async (req, res) => {
    const bucketList = await s3Services.getS3BucketList();
    if (bucketList) {
        res.status(201).send({ bucketList });
    } else {
        res.status(500).send("Not Found");
    }
};

const getS3Data = async (req, res) => {
    const data = await s3Services.getS3Data(req.params.accountId);
    res.status(200).send({ data: data });
};

module.exports = { getBucketList, getS3Data }