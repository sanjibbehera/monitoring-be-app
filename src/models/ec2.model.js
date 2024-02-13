const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const ec2schema = mongoose.Schema(
  {
    accountId: {
      type: String,
      required: false,
      index: true,
    },
    instanceType: {
      type: String,
      required: false,
      index: true,
    },
    instanceId: {
      type: String,
      required: false,
      index: true,
    },
    virtualizationType: {
      type: String,
      required: false,
      index: true,
    },
    tags: {
      type: Array,
      required: false,
      index: true,
    },
    vpcId: {
      type: String,
      required: false,
      index: true,
    },
    subnetId: {
      type: String,
      required: false,
      index: true,
    },
    status: {
      type: String,
      required: false,
      index: true,
    },
    publicIp: {
      type: String,
      required: false,
      index: true,
    },
    ipOwnerId: {
      type: String,
      required: false,
      index: true,
    },
    privateDnsName: {
      type: String,
      required: false,
      index: true,
    },
    privateIpAddress: {
      type: String,
      required: false,
      index: true,
    },
    publicDnsName: {
      type: String,
      required: false,
      index: true,
    },
    attachmentId: {
      type: String,
      required: false,
      index: true,
    },
    ebsVolumeId: {
      type: String,
      required: false,
      index: true,
    },
    availabilityZone: {
      type: String,
      required: false,
      index: true,
    },
    imageId: {
      type: String,
      required: false,
      index: true,
    },
    macAddress: {
      type: String,
      required: false,
      index: true,
    },
    monitoring: {
      type: JSON,
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
ec2schema.plugin(toJSON);

/**
 * @typedef Setting
 */
const Ec2Details = mongoose.model("Ec2Details", ec2schema);

module.exports = Ec2Details;
