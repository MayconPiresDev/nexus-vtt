import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class DicerollerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 Novo aventureiro ligado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Aventureiro desligou-se: ${client.id}`);
  }

  @SubscribeMessage('joinCampaign')
  handleJoinRoom(
    @MessageBody() data: { campaignId: string; playerName: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.campaignId);

    client.to(data.campaignId).emit('playerJoined', {
      message: `${data.playerName} puxou uma cadeira na taverna.`,
    });

    return {
      event: 'joined',
      data: `Entrou na sala da campanha ${data.campaignId}`,
    };
  }

  @SubscribeMessage('rollDice')
  handleRollDice(
    @MessageBody()
    data: { campaignId: string; playerName: string; faces: number },
    @ConnectedSocket() client: Socket,
  ) {
    const result = Math.floor(Math.random() * data.faces) + 1;

    const isCriticalSuccess = data.faces === 20 && result === 20;
    const isCriticalFailure = data.faces === 20 && result === 1;

    const payload = {
      player: data.playerName,
      diceType: `D${data.faces}`,
      result: result,
      isCriticalSuccess,
      isCriticalFailure,
      timestamp: new Date().toISOString(),
    };

    this.server.to(data.campaignId).emit('diceRolled', payload);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody()
    data: {
      campaignId: string;
      playerName: string;
      message: string;
      isWhisperToMaster?: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const payload = {
      player: data.playerName,
      message: data.message,
      isWhisper: data.isWhisperToMaster || false,
      timestamp: new Date().toISOString(),
    };

    this.server.to(data.campaignId).emit('newMessage', payload);
  }
}
