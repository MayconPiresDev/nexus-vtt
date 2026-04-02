import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto, playerId: string) {
    const { campaignId, characterId } = createApplicationDto;

    const character = await this.prisma.character.findFirst({
      where: { id: characterId, userId: playerId },
    });

    if (!character)
      throw new ForbiddenException('Este personagem não pertence a você!');

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) throw new NotFoundException('Campanha não encontrada.');

    const alreadyApplied = await this.prisma.campaignApplication.findFirst({
      where: { campaignId, playerId },
    });

    if (alreadyApplied)
      throw new ConflictException('Você já se inscreveu nesta campanha!');

    return this.prisma.campaignApplication.create({
      data: {
        campaignId,
        playerId,
        characterId,
      },
    });
  }

  async updateStatus(
    id: string,
    masterId: string,
    updateDto: UpdateApplicationDto,
  ) {
    const application = await this.prisma.campaignApplication.findUnique({
      where: { id },
      include: { campaign: true },
    });

    if (!application) throw new NotFoundException('Inscrição não encontrada.');

    if (application.campaign.masterId !== masterId) {
      throw new ForbiddenException(
        'Apenas o mestre desta campanha pode aprovar ou rejeitar jogadores.',
      );
    }

    return this.prisma.campaignApplication.update({
      where: { id },
      data: { status: updateDto.status },
    });
  }
}
