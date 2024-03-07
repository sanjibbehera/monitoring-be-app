const { awsServices } = require("../services");

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

const getCPUHistory = async (req, res) => {
  const data = await awsServices.getCPUHistory(req.params.accountId);
  if (data) {
    res.status(201).send({ cpu: data.data_cpu });
  } else {
    res.status(500).send("Not Found");
  }
};

const getEc2StorageUtilizationL = async (req, res) => {
  const data = await awsServices.getEc2StorageUtilizationL(
    req.params.accountId
  );
  if (data) {
    res.status(201).send({
      cpu: data.data_cpu,
      disk: data.data_storage,
      average: data.average,
    });
  } else {
    res.status(500).send("Not Found");
  }
};

const getInstances = async (req, res) => {
  const data = await awsServices.getInstances();
  if (data) {
    res.status(201).send({ data });
  } else {
    res.status(500).send("Not Found");
  }
};

const getInstanceDetails = async (req, res) => {
  const data = await awsServices.getInstanceDetails(req.params.Id);
  if (data) {
    res.status(201).send({ data });
  } else {
    res.status(500).send("Not Found");
  }
};

module.exports = {
  saveEc2Services,
  getCPUdetails,
  getEc2Services,
  getDataStorageDetails,
  getEc2StorageUtilizationL,
  getCPUHistory,
  getInstances,
  getInstanceDetails,
};
