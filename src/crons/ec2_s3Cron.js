const cron = require("node-cron");
const { awsServices } = require("../services");


const saveCPUDataCron = () => {
    cron.schedule("*/15 * * * *", async () => {
        await awsServices.getCpuDetailsService();
        console.log("saving every 15 minute")
        
    })
}

module.exports = saveCPUDataCron;