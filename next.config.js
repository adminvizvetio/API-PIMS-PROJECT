/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SQLSRV_HOST: process.env.SQLSRV_HOST,
    SQLSRV_DATABASE: process.env.SQLSRV_DATABASE,
    SQLSRV_PULSE_DATABASE: process.env.SQLSRV_PULSE_DATABASE,
    SQLSRV_USERNAME: process.env.SQLSRV_USERNAME,
    SQLSRV_PASSWORD: process.env.SQLSRV_PASSWORD,
    SQLSRV_PORT: process.env.SQLSRV_PORT,
    LOCAL_URL: process.env.LOCAL_URL,
    EZY_API_URL: process.env.EZY_API_URL,
    PARTNER_ID: process.env.PARTNER_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    GRANT_TYPE: process.env.GRANT_TYPE,
    SCOPE: process.env.SCOPE,
    PULSE_AUTH_API_URL: process.env.PULSE_AUTH_API_URL,
    PULSE_API_URL: process.env.PULSE_API_URL,
    PULSE_GRANT_TYPE: process.env.PULSE_GRANT_TYPE,
    PULSE_CLIENT_ID: process.env.PULSE_CLIENT_ID,
    PULSE_AUDIENCE: process.env.PULSE_AUDIENCE,
    PULSE_USER_NAME: process.env.PULSE_USER_NAME,
    PULSE_PASSWORD: process.env.PULSE_PASSWORD,
    PULSE_REALM: process.env.PULSE_REALM,
    PULSE_INSTALLATION: process.env.PULSE_INSTALLATION,
  },
};

module.exports = nextConfig;
