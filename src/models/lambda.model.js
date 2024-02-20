const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const lambdaschema = mongoose.Schema(
    {
        accountId: {
            type: String,
            required: false,
            index: true,
        },
        functionName: {
            type: String,
            required: false,
            index: true,
        },
        runTime: {
            type: String,
            required: false,
            index: true,
        },
        handler: {
            type: String,
            required: false,
            index: true,
        },
        codeSize: {
            type: Number,
            required: false,
            index: true,
        },
        memorySize: {
            type: Number,
            required: false,
            index: true
        },
        lastModified: {
            type: Date,
            required: false,
            index: true
        }

    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
lambdaschema.plugin(toJSON);

/**
 * @typedef Setting
 */
const lambdaDetails = mongoose.model("lambdaDetails", lambdaschema);

module.exports = lambdaDetails;