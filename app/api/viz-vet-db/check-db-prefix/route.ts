import { PREFIX_EZY, PREFIX_PULSE } from "@/utils/constants";
import sql from "mssql";

export async function POST(request: Request) {
  const { config } = await request.json();

  let pool: sql.ConnectionPool | undefined;

  if (!pool) {
    try {
      let myConfig: sql.config = {
        user: config.sqlsrv_env_username as string, // SQL Server username
        password: config.sqlsrv_env_password as string, // SQL Server password
        server: config.sqlsrv_env_host as string, // Server name or IP address
        database: config.sqlsrv_env_database as string, // Database name
        port: parseInt(config.sqlsrv_env_port, 10),
        options: {
          encrypt: true, // Use encryption
          trustServerCertificate: true, // Required for self-signed certificates
        },
      };

      const { prefix } = config;

      pool = await sql.connect(myConfig);

      const result = await pool
        .request()
        .query(`SELECT name FROM sys.tables WHERE name LIKE '${prefix}%';`);

      if (pool) {
        await pool.close();
      }

      return Response.json(result.recordset);
    } catch (err) {
      console.error("Database connection failed: ", err);
      return Response.json(
        { error: "Database connection failed:" },
        { status: 500 }
      );
    }
  }
}
