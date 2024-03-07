const express = require("express");
const settingController = require("../../controllers/settings.controller");
const awsController = require("../../controllers/aws.controller");
const s3Controller = require("../../controllers/s3.controller");

const router = express.Router();

router.post("/addClientSetting", settingController.createClientSetting);

router.get("/saveEc2Services", awsController.saveEc2Services);

router.get("/getEC2Details", awsController.getCPUdetails);

router.get("/getEc2Services/:accountId", awsController.getEc2Services);

router.get("/getCPUHistory/:accountId", awsController.getCPUHistory);

router.get(
  "/getEc2StorageUtilization/:accountId",
  awsController.getEc2StorageUtilizationL
);

router.get("/saves3data", s3Controller.getBucketList);

router.get("/gets3data/:accountId", s3Controller.getS3Data);

router.get("/getInstances", awsController.getInstances);

router.get("/getInstanceDetails/:Id", awsController.getInstanceDetails);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: EC2
 *   description: APIs related EC2 service
 */

/**
 * @swagger
 * tags:
 *   name: S3
 *   description: APIs related S3 service
 */

/**
 * @swagger
 * /users/getCPUHistory/{accountId}:
 *   get:
 *     summary: Get CPU data
 *     tags: [EC2]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: AccountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID of the client
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *
 */

/**
 * @swagger
 * /users/getEc2StorageUtilization/{accountId}:
 *   get:
 *     summary: Get storage data
 *     tags: [EC2]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: Account ID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID of the client
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *
 */

/**
 * @swagger
 * /users/gets3data/{accountId}:
 *   get:
 *     summary: Get S3 data
 *     tags: [S3]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: Account ID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID of the client
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *
 */
