const AWS = require("aws-sdk");

// Function to check if an AWS account ID is valid
const isValidAccount = async (accountId, clientRegion) => {
  try {
    // Create a new STS object
    const sts = new AWS.STS();
    // Set up AWS region
    AWS.config.update({ clientRegion });

    const data = await sts.getCallerIdentity().promise();
    const callerAccountId = data.Account;

    return accountId === callerAccountId;
  } catch (error) {
    console.error("Error checking AWS account ID:", error);
    return false;
  }
};

module.exports = { isValidAccount };
