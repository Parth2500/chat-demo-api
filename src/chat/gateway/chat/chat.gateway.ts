import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  AuthenticationToken,
  IAuthenticationService,
} from 'src/authentication/services/iservices/authentication.service.interface';
import { IUser } from 'src/user/entities/user.interface';
import {
  IUserService,
  UserServiceToken,
} from 'src/user/services/iservices/user.service.interface';

@WebSocketGateway({ cors: { origin: ['http://localhost:4200'] } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  array: string[] = [];

  constructor(
    @Inject(AuthenticationToken) private authService: IAuthenticationService,
    @Inject(UserServiceToken) private userService: IUserService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.validateJwt(
        socket.handshake.headers.authorization,
      );
      const user: IUser = await this.userService.findByIdPromise(
        decodedToken?.user?.Id,
      );

      if (!user) {
        return this.disconnect(socket);
      } else {
        this.array.push(`val:${Math.random()}`);
        this.server.emit('message', this.array);
      }
    } catch (error) {
      return this.disconnect(socket);
    }
  }

  afterInit() {
    console.log('init!');
    this.server.emit('message', 'initialized!');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('message', 'test!');
    return 'Hello world!';
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }
}
