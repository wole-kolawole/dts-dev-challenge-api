import dotenv from 'dotenv';
import mssql, { config as SqlConfig, ConnectionPool, Request } from 'mssql';
import msSql from 'msnodesqlv8';

dotenv.config();

const useTrustedConnection = process.env.DB_TRUSTED_CONNECTION === 'true';
const sqlDriver = process.env.DB_DRIVER || (useTrustedConnection ? 'msnodesqlv8' : 'tedious');

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;
const server = process.env.DB_HOST || 'localhost';
const database = process.env.DB_DATABASE || 'TaskManager';
const encrypt = process.env.DB_ENCRYPT === 'true';
const trustServerCertificate = process.env.DB_TRUST_SERVER_CERT === 'true';

const baseConfig: SqlConfig = {
  server,
  ...(port ? { port } : {}),
  database,
  options: {
    encrypt,
    trustServerCertificate,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const poolConfig: SqlConfig = {
  ...baseConfig,
  driver: sqlDriver,
  ...(useTrustedConnection
    ? {
        options: {
          ...baseConfig.options,
          trustedConnection: true,
        },
      }
    : {
        user: process.env.DB_USER || 'sa',
        password: process.env.DB_PASSWORD || '',
      }),
};

let pool: ConnectionPool | null = null;
let sqlConnection: any | null = null;

function getSqlConnectionString(): string {
  const driverName = 'SQL Server Native Client 11.0';
  return `Driver={${driverName}};Server=${server};Database=${database};Trusted_Connection=Yes;Encrypt=${encrypt ? 'yes' : 'no'};TrustServerCertificate=${trustServerCertificate ? 'yes' : 'no'}`;
}

function formatSqlQuery(queryString: string, input?: Record<string, any>): { sql: string; values: any[] } {
  if (!input || Object.keys(input).length === 0) {
    return { sql: queryString, values: [] };
  }

  const values = Object.values(input);
  const sql = queryString.replace(/@\w+/g, '?');
  return { sql, values };
}

async function getSqlConnection(): Promise<any> {
  if (sqlConnection) {
    return sqlConnection;
  }

  sqlConnection = await msSql.promises.open(getSqlConnectionString());
  return sqlConnection;
}

export async function getPool(): Promise<ConnectionPool> {
  if (sqlDriver === 'msnodesqlv8') {
    return getSqlConnection();
  }

  if (pool && pool.connected) {
    return pool;
  }

  pool = await mssql.connect(poolConfig);
  return pool;
}

export async function query<T = any>(queryString: string, input?: Record<string, any>): Promise<T[]> {
  if (sqlDriver === 'msnodesqlv8') {
    const connection = await getSqlConnection();
    const { sql, values } = formatSqlQuery(queryString, input);
    const result = await connection.promises.query(sql, values);
    return result.first ?? [];
  }

  const connection = await getPool();
  const request = new Request(connection);

  if (input) {
    Object.entries(input).forEach(([key, value]) => request.input(key, value));
  }

  const result = await request.query<T>(queryString);
  return result.recordset;
}

export async function execute<T = any>(queryString: string, input?: Record<string, any>): Promise<{ recordset: T[]; rowsAffected: number[] }> {
  if (sqlDriver === 'msnodesqlv8') {
    const connection = await getSqlConnection();
    const { sql, values } = formatSqlQuery(queryString, input);
    const result = await connection.promises.query(sql, values);
    return {
      recordset: result.first ?? [],
      rowsAffected: result.rowsAffected ?? [],
    };
  }

  const connection = await getPool();
  const request = new Request(connection);

  if (input) {
    Object.entries(input).forEach(([key, value]) => request.input(key, value));
  }

  const result = await request.query<T>(queryString);
  return {
    recordset: result.recordset,
    rowsAffected: result.rowsAffected,
  };
}
