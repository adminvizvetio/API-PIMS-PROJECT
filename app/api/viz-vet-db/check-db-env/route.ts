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

      pool = await sql.connect(myConfig);
      if (pool) {
        await pool.close();
      }
      console.log("Connected to SQL Server");
      return Response.json({ message: "Connected to SQL Server" });
    } catch (err) {
      console.error("Database connection failed: ", err);
      return Response.json(
        { error: "Database connection failed:" },
        { status: 500 }
      );
    }
  }
}
