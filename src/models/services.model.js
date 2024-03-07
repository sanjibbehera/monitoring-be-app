const mongoose = require('mongoose');

const servicesSchema = mongoose.Schema(
    {
        accountId: {
            type: String,
            required: true,
            trim: true,
        },
        services: {
            type: JSON,
            required: true
        }

    },
    {
        timestamps: true,
    }
);


const Services = mongoose.model('Services', servicesSchema);

module.exports = Services;