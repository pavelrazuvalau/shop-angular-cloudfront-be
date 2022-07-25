import { Client as PostgreSQLClient, ClientConfig } from 'pg';
import setupQuery from '@queries/setup.query';
// import insertMockProductsQuery from '@queries/insert-mock-products.query';

const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME
} = process.env;

class DBClient {
  private readonly pendingConnectionPromise: Promise<any>;
  private client: PostgreSQLClient;

  constructor() {
    const clientConfig: ClientConfig = {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 5000,
    };

    this.client = new PostgreSQLClient(clientConfig);

    this.pendingConnectionPromise = this.client.connect()
      .then(() => this.setupDatabase());
  }

  public async performQuery<T>(query: string): Promise<T[]> {
    await this.pendingConnectionPromise;

    const queryResult = await this.client.query<T>(query);

    return queryResult.rows;
  }

  public end(): Promise<void> {
    return this.client.end();
  }

  private async setupDatabase(): Promise<void> {
    await this.client.query(setupQuery);
    // await this.client.query(insertMockProductsQuery);
  }
}

export default new DBClient();
