import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * JWT configuration factory
 * @param configService - NestJS ConfigService instance
 * @returns JWT configuration options
 */
export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET', 'default-secret-key-change-in-production'),
  signOptions: {
    expiresIn: '1h',
  },
});
