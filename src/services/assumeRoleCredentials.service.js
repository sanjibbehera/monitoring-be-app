const awsConfig = require("./awsConfig.service");
const AWS = awsConfig();
const sts = new AWS.STS();

// Function to check if an AWS account ID is valid
const refreshAssumeCredentials = async (assumeRoleParams) => {
  try {
    // Refresh the assumed role
    const data = await sts.assumeRole(assumeRoleParams).promise();

    // Update the credentials with new temporary credentials
    const credentials = {
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken,
    };
    AWS.config.update({ credentials });
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = { refreshAssumeCredentials };
