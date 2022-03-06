const env = process.env.NODE_ENV || 'development';

let config = {
    development: {
        personalNumber: '+33123456789'
    },
    production: {
        personalNumber: '+33123456789'
    }
};

console.log("--- env: ", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;