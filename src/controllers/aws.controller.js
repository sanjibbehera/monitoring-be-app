const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { awsServices } = require("../services");

// const getServices = catchAsync(async (req, res) => {
//   AWS.config.update({
//     accessKeyId: "AKIA3VYSEIZ3WAH6OSDA",
//     secretAccessKey: "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",
//     region: "ap-south-1",
//   });

//   // Create an S3 service object
//   const s3 = new AWS.S3();

//   // Function to list S3 buckets
//   function listS3Buckets() {
//     return new Promise((resolve, reject) => {
//       s3.listBuckets((err, data) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(data.Buckets);
//         }
//       });
//     });
//   }

//   // Call the function to list S3 buckets
//   listS3Buckets()
//     .then((buckets) => {
//       console.log("S3 Buckets:");
//       const bucketNames = buckets.map((bucket) => bucket.Name);
//       res.json({ "s3 Buckets": bucketNames }); // Send JSON response with bucket names
//     })
//     .catch((err) => {
//       console.error("Error:", err);
//       res.status(500).json({ error: err.message }); // Send error response
//     });
// });

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

const saveEc2Services = async (req, res) => {
  const services = await awsServices.getSubscribedServices();
  if (services) {
    //insert service
    const saveData = await awsServices.createServiceDetails(services);
    if (saveData) {
      res.status(201).send({ saveData });
    } else {
      res.status(500).send("Error inserting data");
    }
  } else {
    res.status(500).send("Not Found");
  }
};

const getEc2Services = async (req, res) => {
  const data = await awsServices.getEc2ServicesData(req.params.accountId);
  res.status(200).send({ data: data });
};

const getCPUdetails = async (req, res) => {
  const data = await awsServices.getCpuDetailsService();
  if (data) {
    res.status(201).send({ data });
  } else {
    res.status(500).send("Not Found");
  }
};

const getDataStorageDetails = async (req, res) => {
  const data = await awsServices.getDataStorageDetails();
  if (data) {
    res.status(201).send({ data });
  } else {
    res.status(500).send("Not Found");
  }
};

const getEc2StorageUtilization = async (req, res) => {
  const data = await awsServices.getEc2StorageUtilization(req.params.accountId);
  if (data) {
    res.status(201).send({ cpu: data.data_cpu, disk: data.data_storage , average : data.average });
  } else {
    res.status(500).send("Not Found");
  }
};

const getEc2StorageUtilizationL = async (req, res) => {
  const data = await awsServices.getEc2StorageUtilizationL(req.params.accountId);
  if (data) {
    res.status(201).send({ cpu: data.data_cpu, disk: data.data_storage , average : data.average });
  } else {
    res.status(500).send("Not Found");
  }
};
module.exports = {
  saveEc2Services,
  getCPUdetails,
  getEc2Services,
  getDataStorageDetails,
  getEc2StorageUtilization,
  getEc2StorageUtilizationL
};
