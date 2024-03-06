const AWS = require("aws-sdk");
const config = require("../config/config");

const configCredentials = () => {
AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region,
  });
 
  return AWS;

};

module.exports = configCredentials;
