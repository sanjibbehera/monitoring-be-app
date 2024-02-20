const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const settingController = require("../../controllers/settings.controller");
const awsController = require("../../controllers/aws.controller");
const s3Controller = require("../../controllers/s3.controller");
const lambdaController = require("../../controllers/lambda.controller");

const router = express.Router();

router.post("/addClientSetting", settingController.createClientSetting);

router.get("/saveEc2Services", awsController.saveEc2Services);

router.get("/getCPUDetails", awsController.getCPUdetails);

router.get("/getStorageDetails", awsController.getDataStorageDetails);

router.get("/getEc2Services/:accountId", awsController.getEc2Services);

router.get("/saves3data", s3Controller.getBucketList);
router.get("/gets3data/:accountId", s3Controller.getS3Data);

router.get("/saveLambdaList", lambdaController.saveLambdaList);

module.exports = router;
