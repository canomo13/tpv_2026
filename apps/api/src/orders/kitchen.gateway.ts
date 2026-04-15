import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class KitchenGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Notificar a cocina un nuevo pedido
  notifyNewOrder(orderData: any) {
    this.server.emit('new-order', orderData);
  }

  // Notificar cambio de estado (ej: de cocina a camarero)
  notifyStatusChange(itemData: any) {
    this.server.emit('order-status-changed', itemData);
  }

  @SubscribeMessage('join-kitchen')
  handleJoinKitchen(client: Socket) {
    client.join('kitchen-room');
    return { status: 'joined-kitchen' };
  }
}
