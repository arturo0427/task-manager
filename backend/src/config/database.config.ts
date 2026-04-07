import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envConfig } from './env.config';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: envConfig.database.host,
  port: envConfig.database.port,
  username: envConfig.database.username,
  password: envConfig.database.password,
  database: envConfig.database.name,
  autoLoadEntities: true,
  synchronize: envConfig.database.synchronize,
  retryAttempts: 2,
  retryDelay: 1000,
};
