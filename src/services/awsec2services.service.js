const awsConfig = require("./awsConfig.service");
const { EC2 } = require("../models");
const { exec } = require("child_process");

const AWS = awsConfig();
const sts = new AWS.STS();

const getSubscribedServices = async () => {
  try {
    const assumeRoleParams = {
      RoleArn: "arn:aws:iam::767397878280:role/MonitoringAppsAWSAccessRole", // Specify the ARN of the role to assume
      RoleSessionName: "session-name", // Provide a session name
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

    // Now you can fetch EC2 instances using the assumed role's credentials
    return getEC2Instances();
  } catch (error) {
    console.error("Error assuming role:", error);
  }
};

async function getEC2Instances() {
  try {
    const ec2 = new AWS.EC2();
    const params = {};

    const data = await ec2.describeInstances(params).promise();

    if (data.Reservations.length === 0) {
      console.log("No EC2 instances found.");
    } else {
      console.log("EC2 instances:");
      return data.Reservations;
    }
  } catch (error) {
    console.error("Error fetching EC2 instances:", error);
  }
}

const createServiceDetails = async (data) => {
  data[0].Instances.forEach((instance) => {
    const servicesData = {
      accountId: instance.NetworkInterfaces[0].OwnerId || "N/A",
      instanceId: instance.InstanceId || "N/A",
      instanceType: instance.InstanceType || "N/A",
      virtualizationType: instance.VirtualizationType || "N/A",
      tags: instance.Tags || "N/A",
      vpcId: instance.VpcId || "N/A",
      subnetId: instance.SubnetId || "N/A",
      status: instance.BlockDeviceMappings[0].Ebs.Status || "N/A",
      publicIp: instance.PublicIpAddress || "N/A",
      ipOwnerId: instance.NetworkInterfaces[0].Association.IpOwnerId || "N/A",
      privateDnsName: instance.PrivateDnsName || "N/A",
      privateIpAddress: instance.PrivateIpAddress || "N/A",
      publicDnsName: instance.PublicDnsName || "N/A",
      attachmentId:
        instance.NetworkInterfaces[0].Attachment.AttachmentId || "N/A",
      ebsVolumeId: instance.BlockDeviceMappings[0].Ebs.VolumeId || "N/A",
      availabilityZone: instance.Placement.AvailabilityZone || "N/A",
      imageId: instance.ImageId || "N/A",
      macAddress: instance.NetworkInterfaces[0].macAddress || "N/A",
      monitoring: instance.Monitoring || "N/A",
    };

    EC2.create(servicesData);
  });

  return true;
};

const getCpuDetailsService = async () => {
  const sts = new AWS.STS();
  const assumeRoleParams = {
    RoleArn: "arn:aws:iam::767397878280:role/MonitoringAppsAWSAccessRole",
    RoleSessionName: "AssumeRoleSession2",
  };

  sts.assumeRole(assumeRoleParams, (err, data) => {
    if (err) {
      console.error("Error assuming role:", err);
      return;
    }

    // Configuring AWS SDK with temporary credentials
    const credentials = {
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken,
    };
    AWS.config.update({ credentials });

    // CloudWatch API
    const cloudwatch = new AWS.CloudWatch();

    // Parameters for GetMetricStatistics
    const params = {
      StartTime: new Date(Date.now() - 600000), // 10 minutes ago
      EndTime: new Date(),
      MetricName: "CPUUtilization",
      Namespace: "AWS/EC2",
      Period: 3600,
      Statistics: ["Maximum"],
      Dimensions: [
        {
          Name: "InstanceId",
          Value: "i-0a14b796b6a5c7958",
        },
      ],
    };

    // Fetch CPUUtilization metric
    cloudwatch.getMetricStatistics(params, (err, data) => {
      if (err) {
        console.error("Error fetching metric:", err);
        return;
      }
      if (data.Datapoints.length > 0) {
        console.log("Latest CPU Utilization:", data.Datapoints);
      } else {
        console.log("No data available for the specified time range.");
      }
    });
  });
};

const getDataStorageDetails = async () => {
  const sts = new AWS.STS();

  try {
    // Assume the role
    const data = await sts
      .assumeRole({
        RoleArn: "arn:aws:iam::767397878280:role/MonitoringAppsAWSAccessRole",
        RoleSessionName: "sessionName",
      })
      .promise();

    // Set the credentials with the assumed role
    const assumedCredentials = data.Credentials;

    AWS.config.update({
      accessKeyId: assumedCredentials.AccessKeyId,
      secretAccessKey: assumedCredentials.SecretAccessKey,
      sessionToken: assumedCredentials.SessionToken,
    });

    // Now create an EC2 client with the assumed credentials
    const ec2 = new AWS.EC2();

    // Describe volumes
    const volumes = await ec2.describeVolumes().promise();
    return volumes;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling outside this function if needed
  }
};

const getEc2ServicesData = async (accountId) => {
  const data = EC2.find({
    accountId: accountId,
  });

  return data;
};

module.exports = {
  getSubscribedServices,
  createServiceDetails,
  getCpuDetailsService,
  getEc2ServicesData,
  getDataStorageDetails,
};
