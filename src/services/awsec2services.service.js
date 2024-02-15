const awsConfig = require("./awsConfig.service");
const { EC2 } = require("../models");
const { exec } = require("child_process");
const Ec2Details = require("../models/ec2.model");
const EC2storage = require("../models/ec2storage.model");
const EC2utilization = require("../models/ec2utilization.model");
const assumeCredentials = require("./assumeRoleCredentials.service");

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
    // If the error is due to expired credentials, refresh the credentials and retry
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
      return await getCpuDetailsService();
    } else {
      console.error("Error:", error);
      throw error; // Rethrow the error for handling outside this function if needed
    }
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
  const results = [];

  try {
    const assumeRoleParams = {
      RoleArn: "arn:aws:iam::767397878280:role/MonitoringAppsAWSAccessRole",
      RoleSessionName: "Monitoring_session",
    };

    const data = await sts.assumeRole(assumeRoleParams).promise();

    // Configuring AWS SDK with temporary credentials
    const credentials = {
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken,
    };
    AWS.config.update({ credentials });

    // CloudWatch API
    const cloudwatch = new AWS.CloudWatch();
    let data_c;

    const instanceIds = await Ec2Details.find({
      accountId: "767397878280",
    }).select("instanceId"); // Example array of instance IDs

    // Parameters for GetMetricStatistics
    for (const instanceId of instanceIds) {
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
            Value: instanceId.instanceId,
          },
        ],
      };

      // Fetch CPUUtilization metric

      data_c = await cloudwatch.getMetricStatistics(params).promise();
      results.push({ instanceId, data: data_c.Datapoints });
    }
    const ec2 = new AWS.EC2();
    const volumes = await ec2.describeVolumes().promise();

    const datainfo = {
      metrics: results,
      volumesdisk: volumes,
    };

    for (const metric of datainfo.metrics) {
      const infou = {
        accountId: "767397878280",
        instanceId: metric.instanceId.instanceId,
        cpuData: metric.data,
      };

      EC2utilization.create(infou);
    }

    for (const volume of datainfo.volumesdisk.Volumes) {
      const infov = {
        accountId: "767397878280",
        instanceId: volume.Attachments[0].InstanceId,
        attachments: volume.Attachments,
        availabilityZone: volume.AvailabilityZone,
        createTime: volume.CreateTime,
        encrypted: volume.Encrypted,
        kmsKeyId: volume.KmsKeyId,
        size: volume.Size,
        snapshotId: volume.SnapshotId,
        state: volume.State,
        volumeId: volume.VolumeId,
        iops: volume.Iops,
        tags: volume.Tags,
        volumeType: volume.VolumeType,
        multiAttachEnabled: volume.MultiAttachEnabled,
        throughput: volume.Throughput,
      };
      EC2storage.create(infov);
    }

    return datainfo;
  } catch (error) {
    console.log("hi");
    console.log(error.code);
    // If the error is due to expired credentials, refresh the credentials and retry
    if (error.code === "ExpiredToken") {
      // Refresh the assumed role
      // await assumeCredentials.refreshAssumeCredentials(assumeRoleParams);
      data = await sts.assumeRole(assumeRoleParams).promise();

      // Update the credentials with new temporary credentials
      credentials = {
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken,
      };
      AWS.config.update({ credentials });

      // Retry the operation
      return await getCpuDetailsService();
    } else {
      console.error("Error:", error);
      throw error; // Rethrow the error for handling outside this function if needed
    }
  }
};

const getEc2ServicesData = async (accountId) => {
  const data = EC2.find({
    accountId: accountId,
  });

  return data;
};

const getEc2StorageUtilization = async (accountId) => {
  const data_storage = await EC2storage.find({
    accountId: accountId,
  });

  const data_cpu = await EC2utilization.find({
    accountId: accountId,
  });

  const info = {
    data_storage: data_storage,
    data_cpu: data_cpu,
  };

  return info;
};

module.exports = {
  getSubscribedServices,
  createServiceDetails,
  getCpuDetailsService,
  getEc2ServicesData,
  getEc2StorageUtilization,
};
