const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const AWS = require("aws-sdk");

const getServices = catchAsync(async (req, res) => {
  AWS.config.update({
    accessKeyId: "AKIA3VYSEIZ3R3Y7VZP3",
    secretAccessKey: "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",
    region: "ap-south-1",
  });

  // Create an S3 service object
  const s3 = new AWS.S3();

  // Function to list S3 buckets
  function listS3Buckets() {
    return new Promise((resolve, reject) => {
      s3.listBuckets((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Buckets);
        }
      });
    });
  }

  // Call the function to list S3 buckets
  listS3Buckets()
    .then((buckets) => {
      console.log("S3 Buckets:");
      const bucketNames = buckets.map((bucket) => bucket.Name);
      res.json({ "s3 Buckets": bucketNames }); // Send JSON response with bucket names
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(500).json({ error: err.message }); // Send error response
    });
});

// const getServices = catchAsync(async (req, res) => {
//   // Initialize AWS SDK
//   AWS.config.update({
//     region: "ap-south-1"
//   });

//   const sts = new AWS.STS();

//   // Assume Role parameters
//   const assumeRoleParams = {
//     RoleArn: 'arn:aws:iam::123456789012:role/marketingadminrole',
//     RoleSessionName: "SessionName"
//   };

//   // Assume the role
//   sts.assumeRole(assumeRoleParams, (err, data) => {
//     if (err) {
//       console.error("Error assuming role:", err);
//       res.status(500).json({ error: "Error assuming role" });
//       return;
//     }

//     // Create AWS service object using temporary credentials
//     const tempCredentials = data.Credentials;
//     const s3 = new AWS.S3({
//       accessKeyId: tempCredentials.AccessKeyId,
//       secretAccessKey: tempCredentials.SecretAccessKey,
//       sessionToken: tempCredentials.SessionToken
//     });

//     // Function to list S3 buckets
//     function listS3Buckets() {
//       return new Promise((resolve, reject) => {
//         s3.listBuckets((err, data) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(data.Buckets);
//           }
//         });
//       });
//     }

//     // Call the function to list S3 buckets
//     listS3Buckets()
//       .then((buckets) => {
//         console.log("S3 Buckets:");
//         const bucketNames = buckets.map(bucket => bucket.Name);
//         res.json({ buckets: bucketNames }); // Send JSON response with bucket names
//       })
//       .catch((err) => {
//         console.error("Error:", err);
//         res.status(500).json({ error: err.message }); // Send error response
//       });
//   });
// });

module.exports = { getServices };
