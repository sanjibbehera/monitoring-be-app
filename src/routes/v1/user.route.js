const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const settingController = require("../../controllers/settings.controller");
const awsController = require("../../controllers/aws.controller");

const router = express.Router();

router.post("/addClientSetting", settingController.createClientSetting);
router.get("/getAwsServices", awsController.getServices);

module.exports = router;
