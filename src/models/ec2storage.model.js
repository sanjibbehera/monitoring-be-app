const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const storageSchema = mongoose.Schema(
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
    attachments: {
      type: Array,
      required: false,
      index: true,
    },
    availabilityZone: {
      type: String,
      required: false,
      index: true,
    },
    createTime: {
      type: String,
      required: false,
      index: true,
    },
    encrypted: {
      type: String,
      required: false,
      index: true,
    },
    kmsKeyId: {
      type: String,
      required: false,
      index: true,
    },
    size: {
      type: String,
      required: false,
      index: true,
    },
    snapshotId: {
      type: String,
      required: false,
      index: true,
    },
    state: {
      type: String,
      required: false,
      index: true,
    },
    volumeId: {
      type: String,
      required: false,
      index: true,
    },
    iops: {
      type: String,
      required: false,
      index: true,
    },
    tags: {
      type: Array,
      required: false,
      index: true,
    },
    volumeType: {
      type: String,
      required: false,
      index: true,
    },
    multiAttachEnabled: {
      type: String,
      required: false,
      index: true,
    },
    throughput: {
      type: String,
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
storageSchema.plugin(toJSON);

/**
 * @typedef Setting
 */
const EC2storage = mongoose.model(
  "EC2storage",
  storageSchema
);

module.exports = EC2storage;
