"use server";
import sql from "mssql";

let pool: sql.ConnectionPool | undefined;

export async function getConnection(
  config: any,
  useLocalEvn: boolean
): Promise<sql.ConnectionPool> {
  if (!pool) {
    try {
      let myConfig: sql.config;
      if (useLocalEvn) {
        myConfig = {
          user: process.env.SQLSRV_USERNAME as string, // SQL Server username
          password: process.env.SQLSRV_PASSWORD as string, // SQL Server password
          server: process.env.SQLSRV_HOST as string, // Server name or IP address
          database: process.env.SQLSRV_PULSE_DATABASE as string, // Database name
          port: parseInt(process.env.SQLSRV_PORT as string, 10),
          options: {
            encrypt: true, // Use encryption
            trustServerCertificate: true, // Required for self-signed certificates
          },
          connectionTimeout: 300000, // Increase connection timeout to 100 seconds
          requestTimeout: 300000, // Increase request timeout to 100 seconds
        };
      } else {
        myConfig = {
          user: config.sqlsrv_env_username as string, // SQL Server username
          password: config.sqlsrv_env_password as string, // SQL Server password
          server: config.sqlsrv_env_host as string, // Server name or IP address
          database: config.sqlsrv_env_database as string, // Database name
          port: parseInt(config.sqlsrv_env_port as string, 10),
          options: {
            encrypt: true, // Use encryption
            trustServerCertificate: true, // Required for self-signed certificates
          },
          connectionTimeout: 300000, // Increase connection timeout to 100 seconds
          requestTimeout: 300000, // Increase request timeout to 100 seconds
        };
      }

      pool = await sql.connect(myConfig);
      console.log("Connected to SQL Server");
    } catch (err) {
      console.error("Database connection failed: ", err);
      throw err;
    }
  }
  return pool;
}

export async function closeConnection(): Promise<void> {
  try {
    if (pool) {
      await pool.close();
    }
  } catch (err) {
    console.error("Error closing connection: ", err);
  }
}
