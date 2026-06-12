import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool!: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  onModuleInit() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://gasgrid_admin:gasgrid_secure_pass@localhost:5432/gasgrid';
    this.logger.log('Connecting to PostgreSQL database...');
    
    this.pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async onModuleDestroy() {
    this.logger.log('Closing database connection pool...');
    await this.pool.end();
  }

  async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const result = await this.pool.query<T>(sql, params);
      const duration = Date.now() - start;
      this.logger.debug(`Executed query: ${sql.slice(0, 100)}... in ${duration}ms`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to execute query: ${sql}`, error);
      throw error;
    }
  }

  async getClient() {
    return this.pool.connect();
  }
}
