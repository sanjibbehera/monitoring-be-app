const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const settingSchema = mongoose.Schema(
  {
    accountId: {
      type: String,
      required: false,
      index: true,
    },
    accessKeyId: {
      type: String,
      required: true,
      index: true,
    },
    secretAccessKey: {
      type: String,
      required: true,
      index: true,
    },
    region: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
settingSchema.plugin(toJSON);

/**
 * @typedef Setting
 */
const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
