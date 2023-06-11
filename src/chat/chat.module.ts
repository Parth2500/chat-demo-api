import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat/chat.gateway';

const modules = [AuthenticationModule, UserModule];

const providers = [ChatGateway];

@Module({
  imports: [...modules],
  providers: [...providers],
})
export class ChatModule {}
