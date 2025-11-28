import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

/**
 * Database configuration factory for TypeORM
 * @param configService - NestJS ConfigService instance
 * @returns TypeORM configuration options
 */
export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: configService.get<string>('DB_PATH', 'products.sqlite'),
  entities: [Product, User],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging: configService.get<string>('NODE_ENV') === 'development',
});
