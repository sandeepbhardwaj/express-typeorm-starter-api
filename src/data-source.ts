import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { ApplicationConfig as config } from './config/config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: 3306,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
  // dev properties -- do not use in production
  dropSchema: true
});
