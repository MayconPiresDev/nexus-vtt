import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(createCampaignDto: CreateCampaignDto, masterId: string) {
    return this.prisma.campaign.create({
      data: {
        ...createCampaignDto,
        masterId: masterId,
      },
    });
  }

  findAll(userId: string, role: string) {
    if (role === 'MASTER' || role === 'BOTH') {
      return this.prisma.campaign.findMany({
        where: { masterId: userId },
        include: { _count: { select: { applications: true } } },
      });
    }

    return this.prisma.campaign.findMany({
      where: {
        status: CampaignStatus.OPEN,
        masterId: { not: userId },
      },
    });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        master: { select: { name: true, experienceLevel: true } },
      },
    });

    if (!campaign) throw new NotFoundException('Campanha não encontrada');
    return campaign;
  }

  async update(
    id: string,
    userId: string,
    updateCampaignDto: UpdateCampaignDto,
  ) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');

    if (campaign.masterId !== userId) {
      throw new ForbiddenException(
        'Apenas o Mestre criador pode editar esta campanha.',
      );
    }

    return this.prisma.campaign.update({
      where: { id },
      data: updateCampaignDto,
    });
  }

  async remove(id: string, userId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');

    if (campaign.masterId !== userId) {
      throw new ForbiddenException(
        'Apenas o Mestre criador pode encerrar e deletar esta campanha.',
      );
    }

    return this.prisma.campaign.delete({
      where: { id },
    });
  }
}
