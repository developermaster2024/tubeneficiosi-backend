import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Role } from 'src/users/enums/roles.enum';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    console.log({sockets: this.server.engine.clientsCount});
  }

  @WebSocketServer()
  public server: Server;

  notifyUsersById(userIds: number[], args: any) {
    userIds.forEach((id) => {
      this.server.emit(`user.${id}`, args);
    });
  }

  notifyUsersByRole(roles: Role[], args: any) {
    roles.forEach((role) => {
      this.server.emit(role, args);
    });
  }
}
