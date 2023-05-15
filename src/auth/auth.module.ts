import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigService } from 'src/shared/api-config.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { IsUniqueConstraint } from './validators/is-unique';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        signOptions: { expiresIn: configService.authConfig.jwtExpirationTime },
        secret: configService.authConfig.jwtSecret,
      }),
      inject: [ApiConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy, IsUniqueConstraint],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
