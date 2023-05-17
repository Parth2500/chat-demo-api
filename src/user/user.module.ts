import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { UserHelperService } from './services/user-helper/user-helper.service';
import { UserHelperServiceToken } from './services/iservices/user-helper.service.interface';
import { UserServiceToken } from './services/iservices/user.service.interface';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthenticationModule],
  controllers: [UserController],
  providers: [
    { provide: UserServiceToken, useClass: UserService },
    { provide: UserHelperServiceToken, useClass: UserHelperService },
  ],
})
export class UserModule {}
