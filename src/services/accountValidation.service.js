const AWS = require('aws-sdk');

// Create a new STS object
const sts = new AWS.STS();

// Function to check if an AWS account ID is valid
async function isValidAccount(accountId, clientRegeion) {
    try {
        // Set up AWS credentials and region
        AWS.config.update({ region: clientRegeion });
        const data = await sts.getCallerIdentity().promise();
        const callerAccountId = data.Account;

        return accountId === callerAccountId;
    } catch (error) {
        console.error('Error checking AWS account ID:', error);
        return false;
    }
}


module.exports = { isValidAccount }    