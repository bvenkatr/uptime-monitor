/**
 * Create and export configuraton variables
 *
 */

// Container for all environments
let environments = {};

// Staging (default) environment
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging"
};

// Production environment
environments.production = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "production"
};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : '';

// Check that the current environment is one of the environments above, if not default to string
let environmentToExport = typeof(environments[process.env.NODE_ENV]) === "object" ? environments[process.env.NODE_ENV] : "staging";

// Export the module
module.exports = environmentToExport;
