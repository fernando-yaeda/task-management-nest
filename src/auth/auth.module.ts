import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { IsUniqueConstraint } from './validators/is-unique';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'top-secret',
      signOptions: { expiresIn: 3600 },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy, IsUniqueConstraint],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
