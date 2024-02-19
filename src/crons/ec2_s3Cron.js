const cron = require("node-cron");
const { awsServices } = require("../services");


const saveCPUDataCron = () => {
    cron.schedule("*/1 * * * *", async () => {
        console.log("hi cron")
        await awsServices.getCpuDetailsService();
        console.log("saving every minute")
        
    })
}

module.exports = saveCPUDataCron;