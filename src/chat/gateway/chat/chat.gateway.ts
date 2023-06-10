import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: ['http://localhost:4200'] } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server;

  handleConnection() {
    console.info('Connected Successfully!');
    this.server.emit('message', 'connected!');
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

  handleDisconnect() {
    console.error('Connection Disconnected!');
    this.server.emit('message', 'disconnected!');
  }
}
