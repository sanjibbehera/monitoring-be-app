const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { settingService } = require("../services");

const createClientSetting = catchAsync(async (req, res) => {
  const setting = await settingService.createClientSetting(req.body);
  res.status(httpStatus.CREATED).send(setting);
});

const updateClientSetting = catchAsync(async (req, res) => {
  const setting = await settingService.updateClientSettingById(
    req.params.settingId,
    req.body
  );
  res.send(setting);
});

const deleteClientSetting = catchAsync(async (req, res) => {
  await settingService.deleteClientSettingById(req.params.settingId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createClientSetting,
  updateClientSetting,
  deleteClientSetting,
};
