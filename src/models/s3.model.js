const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const s3schema = mongoose.Schema(
    {
        accountId: {
            type: String,
            required: false,
            index: true,
        },
        bucketName: {
            type: String,
            required: false,
            index: true,
        },
        creationDate: {
            type: Date,
            required: false,
            index: true,
        },
        totalSizeBytes: {
            type: Number,
            required: false,
            index: true,
        },
        totalSizeGB: {
            type: Number,
            required: false,
            index: true
        }


    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
s3schema.plugin(toJSON);

/**
 * @typedef Setting
 */
const s3Details = mongoose.model("s3Details", s3schema);

module.exports = s3Details;
