const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const utilizationSchema = mongoose.Schema(
  {
    accountId: {
      type: String,
      required: false,
      index: true,
    },
    instanceId: {
      type: String,
      required: false,
      index: true,
    },
    cpuData: {
      type: Array,
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
utilizationSchema.plugin(toJSON);

/**
 * @typedef Setting
 */
const EC2utilization = mongoose.model(
  "EC2utilization",
  utilizationSchema
);

module.exports = EC2utilization;
