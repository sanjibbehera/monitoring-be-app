const awsConfig = require("./awsConfig.service");
const { S3 } = require("../models");
const { util } = require("prettier");
const { refreshAssumeCredentials } = require("./assumeRoleCredentials.service");

const AWS = awsConfig();
const sts = new AWS.STS();

const getS3BucketList = async () => {
  try {
    //const dynamicSessionName = `EC2Services_role2_${Date.now()}`;
    const assumeRoleParams = {
      RoleArn: "arn:aws:iam::767397878280:role/MonitoringAppsAWSAccessRole", // Specify the ARN of the role to assume
      RoleSessionName: "Monitoring_session", // Provide a session name
    };

    const assumedRole = await sts.assumeRole(assumeRoleParams).promise();

    // Extract temporary credentials from the assumed role response
    const tempCredentials = {
      accessKeyId: assumedRole.Credentials.AccessKeyId,
      secretAccessKey: assumedRole.Credentials.SecretAccessKey,
      sessionToken: assumedRole.Credentials.SessionToken,
    };

    // Set temporary credentials to the AWS configuration
    AWS.config.update({ credentials: tempCredentials });

    return listS3Buckets();
  } catch (error) {
    if (error.code === "ExpiredToken") {
      // Refresh the assumed role
      data = await sts.assumeRole(assumeRoleParams).promise();

      // Update the credentials with new temporary credentials
      credentials = {
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken,
      };
      AWS.config.update({ credentials });

      // Retry the operation
      return await getS3BucketList();
    } else {
      console.error("Error:", error);
      throw error; // Rethrow the error for handling outside this function if needed
    }

    //console.error("Error:", error);
  }
};

// Function to list S3 buckets
async function listS3Buckets() {
  try {
    const s3 = new AWS.S3();

    // Retrieve list of buckets
    const { Buckets } = await s3.listBuckets().promise();

    if (Buckets.length === 0) {
      console.log("No S3 buckets found.");
      return [];
    } else {
      // Iterate over each bucket
      const bucketDetails = await Promise.all(
        Buckets.map(async (bucket) => {
          console.log(`Bucket: ${bucket.Name}`);

          // Get bucket size
          const params = {
            Bucket: bucket.Name,
          };
          const { Contents } = await s3.listObjectsV2(params).promise();

          if (Contents && Contents.length > 0) {
            // Calculate total size of objects
            const totalSizeBytes = Contents.reduce(
              (total, obj) => total + obj.Size,
              0
            );
            const totalSizeGB = totalSizeBytes / (1024 * 1024 * 1024); // Convert bytes to gigabytes

            console.log(`Total size: ${totalSizeGB.toFixed(2)} GB`);

            const bucketInfo = {
              accountId: 767397878280,
              bucketName: bucket.Name,
              creationDate: bucket.CreationDate,
              totalSizeBytes,
              totalSizeGB,
            };
            S3.create(bucketInfo);
            return bucketInfo;
          } else {
            console.log("Bucket is empty.");
            const bucketInfo = {
              accountId: 767397878280,
              bucketName: bucket.Name,
              creationDate: bucket.CreationDate,
              totalSizeBytes: 0,
              totalSizeGB: 0,
            };
            S3.create(bucketInfo);
            return bucketInfo;
          }
        })
      );

      return bucketDetails;
    }
  } catch (error) {
    console.error("Error fetching S3 buckets:", error);
    throw error;
  }
}

const getS3Data = async (accountId) => {
  const data = S3.find({
    accountId: accountId,
  }).select('-accountId');

  return data;
};

module.exports = { getS3BucketList, getS3Data };
