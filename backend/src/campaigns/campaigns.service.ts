import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CampaignStatus, Prisma } from '@prisma/client';

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

  async findAll(userId: string, role: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const whereCondition: Prisma.CampaignWhereInput =
      role === 'MASTER' || role === 'BOTH'
        ? { masterId: userId }
        : { status: CampaignStatus.OPEN, masterId: { not: userId } };

    // Executa a contagem total e a busca da página ao mesmo tempo!
    const [total, data] = await this.prisma.$transaction([
      this.prisma.campaign.count({ where: whereCondition }),
      this.prisma.campaign.findMany({
        where: whereCondition,
        skip: skip,
        take: limit, // Limite de itens na página
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' }, // Traz as mais novas primeiro
      }),
    ]);

    // O Frontend precisa saber esses dados para montar os botões [1] [2] [3]
    return {
      data,
      meta: {
        totalItems: total,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
