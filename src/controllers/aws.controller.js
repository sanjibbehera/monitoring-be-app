const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const AWS = require("aws-sdk");


// const getServices = catchAsync(async (req,res) => {
//     console.log("hi")
//   // Configure AWS SDK with your credentials
//   const accountId = "802660042359";
//   const region = "ap-south-1";

//   AWS.config.update({
//     region: region,
//     credentials: new AWS.SharedIniFileCredentials({ profile: "default" }), // or use any other method to set credentials
//   });

//   // Create an AWS IAM service object
//   const iam = new AWS.IAM();

//   // Call the listRoles method to fetch the roles
//   iam.listRoles({}, (err, data) => {
//     if (err) {
//       console.log("Error fetching roles:", err);
//       res.status(500).send({ error: "Error fetching roles" });
//     } else {
//         res.send({ "roles" : data.Roles });
//       //console.log("Roles:", data.Roles);
//     }
//   });
// });

// const getServices = catchAsync(async (req, res) => {
//   // Set the AWS region
//   AWS.config.update({ region: "ap-south-1" });

//   // Create IAM service object
//   const iam = new AWS.IAM();

//   // Define the account ID
//   const accountId = "802660042359";
//   try {
//     const params = {
//       AccountId: accountId,
//     };
//     const data = await iam.listRoles(params).promise();
//     //return data.Roles;
//     res.send({ "roles" : data.Roles });
//   } catch (err) {
//     console.error("Error fetching IAM roles:", err);
//     throw err;
//   }
// });

const getServices = catchAsync(async (req, res) => {
    // Set the AWS region
    AWS.config.update({ region: "ap-south-1" });
  
    // Create STS service object
    const sts = new AWS.STS();
  
    try {
      const params = {
        RoleArn: "arn:aws:iam::802660042359:role/forecast", // Replace with your role ARN
        RoleSessionName: "AssumedRoleSession", // A unique identifier for the assumed role session
      };
  
      // Assume the IAM role to obtain temporary security credentials
      const data = await sts.assumeRole(params).promise();
  
      // Configure the AWS SDK with temporary credentials
    //   const tempCredentials = {
    //     accessKeyId: data.Credentials.AccessKeyId,
    //     secretAccessKey: data.Credentials.SecretAccessKey,
    //     sessionToken: data.Credentials.SessionToken
    //   };
    //   AWS.config.update({
    //     credentials: new AWS.Credentials(tempCredentials),
    //     region: "ap-south-1" // Update the region if needed
    //   });
  
    //   // Now, create IAM service object with temporary credentials
    //   const iam = new AWS.IAM();
  
    //   // List IAM roles
    //   const rolesData = await iam.listRoles().promise();
      
      res.send({ "roles" : data });
    } catch (err) {
      console.error("Error fetching IAM roles:", err);
      throw err;
    }
  });

module.exports = { getServices };
