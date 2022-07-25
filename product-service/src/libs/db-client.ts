import { Client as PostgreSQLClient, ClientConfig, QueryResult } from 'pg';
// @ts-ignore
import insertMockProductsQuery from '@queries/insert-mock-products.query';
import setupQuery from '@queries/setup.query';

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
      .then(() => this.setupDatabase())

  }

  public async getRecords<T>(query: string): Promise<T[]> {
    await this.pendingConnectionPromise;

    const queryResult = await this.performQuery<T>(query);

    return queryResult.rows;
  }

  public end(): Promise<void> {
    return this.client.end();
  }

  private async setupDatabase(): Promise<void> {
    await this.performQuery(setupQuery);
    // await this.fillMockData();
  }

  // @ts-ignore
  private async fillMockData(): Promise<void> {
    await this.performQuery(insertMockProductsQuery);
  }

  private async performQuery<T>(query: string): Promise<QueryResult<T>> {
    return this.client.query(query);
  }
}

export default new DBClient();
