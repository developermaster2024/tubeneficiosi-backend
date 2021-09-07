import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Role } from 'src/users/enums/roles.enum';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection {
  static clientsCount = 0;

  handleConnection(client: any, ...args: any[]) {
    NotificationsGateway.clientsCount++;

    console.log({clientsCount: NotificationsGateway.clientsCount});
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
