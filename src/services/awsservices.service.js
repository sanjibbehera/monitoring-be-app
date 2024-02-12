const AWS = require('aws-sdk');

// Set up AWS credentials and region
AWS.config.update({ region: 'your-region' });

// Create a new STS object
const sts = new AWS.STS();

// Create a new ResourceGroups object
const resourceGroups = new AWS.ResourceGroups();

// Function to assume a role and retrieve subscribed services
const getSubscribedServices = async (data) => {
    try {
        // Assume the role
        const assumeRoleParams = {
            RoleArn: 'arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME', // Specify the ARN of the role to assume
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
        AWS.config.update(tempCredentials);

        // Retrieve subscribed services using temporary credentials
        const searchParams = {
            ResourceTypeFilters: ['AWS::AllSupported'], // Filter to include all supported AWS resource types
            TagFilters: [ // Specify tags to identify subscribed services
                {
                    Key: 'Subscribed',
                    Values: ['true'] // Tag indicating that the service is subscribed
                }
            ]
        };

        const data = await resourceGroups.searchResources(searchParams).promise();

        if (data.ResourceIdentifiers.length === 0) {
            console.log('No subscribed services found.');
        } else {
            console.log('Subscribed services:');
            data.ResourceIdentifiers.forEach(resource => {
                console.log(resource.ResourceType);
            });
        }
    } catch (error) {
        console.error('Error retrieving subscribed services:', error);
    }
}


module.exports = { getSubscribedServices }