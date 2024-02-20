const awsConfig = require("./awsConfig.service");
const { AWSLambda } = require("../models");

const AWS = awsConfig();
const sts = new AWS.STS();
const lambda = new AWS.Lambda();

const getLambdaList = async () => {
    try {
        const assumeRoleParams = {
            RoleArn: "arn:aws:iam::767397878280:role/MonitoringAppsAWSAccessRole", // Specify the ARN of the role to assume
            RoleSessionName: 'session-name' // Provide a session name
        };

        const assumedRole = await sts.assumeRole(assumeRoleParams).promise();

        // Extract temporary credentials from the assumed role response
        const tempCredentials = {
            accessKeyId: assumedRole.Credentials.AccessKeyId,
            secretAccessKey: assumedRole.Credentials.SecretAccessKey,
            sessionToken: assumedRole.Credentials.SessionToken
        };

        // Set temporary credentials to the AWS configuration
        AWS.config.update({ credentials: tempCredentials });

        return listLambdaFunctions();

    } catch (error) {
        console.error('Error assuming role:', error);
    }
}


async function listLambdaFunctions() {
    const cloudwatch = new AWS.CloudWatch();
    const params = {
        Namespace: 'AWS/Lambda',
        MetricName: 'Invocations', // MetricName for Lambda invocation count
        Dimensions: [
            {
                Name: 'functionName',
                Value: 'mylambdaFunctionOne',
            },
        ],
        StartTime: new Date(Date.now() - 86400000), // 24 hours ago
        EndTime: new Date(),
        Period: 300, // 5 minutes
        Statistics: ['Average'],
    };

    const data = await cloudwatch.getMetricStatistics(params).promise();

    console.log(`Metrics data for function :`);
    data.Datapoints.forEach((point) => {
        console.log(`Timestamp: ${point.Timestamp.toISOString()} - Average: ${point.Average}`);
    });



    const functions = await lambda.listFunctions().promise();
    if (functions.Functions.length === 0) {
        console.log("No Lambda functions found.");
        return [];
    } else {
        //loop through functions
        for (const value of functions.Functions) {
            const arnParts = value.FunctionArn.split(':');
            const awsaccountId = arnParts[4];

            const functionName = value.FunctionName;
            const region = arnParts[3];
            //const lambda = new AWS.Lambda({ region });
            const cloudwatch = new AWS.CloudWatch();

            // const params = {
            //     FunctionName: functionName,
            //     StartTime: new Date(Date.now() - 86400000), // 24 hours ago
            //     EndTime: new Date(),
            //     Period: 3600, // Period of 1 hour
            // };



            // lambda.getMetricData(params, (err, data) => {
            //     if (err) {
            //         console.log("Error fetching Lambda function metrics:", err);
            //     } else {
            //         // Invocation Count
            //         if (data.MetricDataResults.length > 0) {
            //             const invocations = data.MetricDataResults[0].Values.reduce((acc, val) => acc + val, 0);
            //             console.log("Invocation count:", invocations);
            //         } else {
            //             console.log("No data available for invocation count.");
            //         }
            //     }
            // });

            // const lambdaDetail = {
            //     accountId: awsaccountId,
            //     functionName: value.FunctionName,
            //     runTime: value.Runtime,
            //     handler: value.Handler,
            //     codeSize: value.CodeSize,
            //     memorySize: value.MemorySize,
            //     lastModified: value.LastModified,
            // }



            //AWSLambda.create(lambdaDetail);

        }
        return functions;
    }

}


module.exports = { getLambdaList };