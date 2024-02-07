const httpStatus = require("http-status");
const { Setting } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a Setting
 * @param {Object} settingBody
 * @returns {Promise<Setting>}
 */
const createClientSetting = async (settingBody) => {
  return Setting.create(settingBody);
};

/**
 * Get setting by id
 * @param {ObjectId} id
 * @returns {Promise<Setting>}
 */
const getClientSettingById = async (id) => {
  return Setting.findById(id);
};

/**
 * Update setting by id
 * @param {ObjectId} settingId
 * @param {Object} updateBody
 * @returns {Promise<Setting>}
 */
const updateClientSettingById = async (settingId, updateBody) => {
  const setting = await getClientSettingById(settingId);
  if (!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, "Setting not found");
  }

  Object.assign(settingId, updateBody);
  await Setting.save();
  return setting;
};

/**
 * Delete setting by id
 * @param {ObjectId} settingId
 * @returns {Promise<Setting>}
 */
const deleteClientSettingById = async (settingId) => {
  const setting = await getClientSettingById(settingId);
  if (!setting) {
    throw new ApiError(httpStatus.NOT_FOUND, "Setting not found");
  }
  await Setting.remove();
  return setting;
};

module.exports = {
  createClientSetting,
  updateClientSettingById,
  deleteClientSettingById,
};
