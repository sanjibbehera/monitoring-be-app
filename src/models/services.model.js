const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

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