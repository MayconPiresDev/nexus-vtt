import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async create(createCharacterDto: CreateCharacterDto, userId: string) {
    return this.prisma.character.create({
      data: {
        ...createCharacterDto,
        userId: userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.character.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const character = await this.prisma.character.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!character) {
      throw new NotFoundException(`Personagem não encontrado na sua conta.`);
    }

    return character;
  }

  async update(
    id: string,
    userId: string,
    updateCharacterDto: UpdateCharacterDto,
  ) {
    await this.findOne(id, userId);

    return this.prisma.character.update({
      where: { id, userId },
      data: updateCharacterDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.character.delete({
      where: { id, userId },
    });
  }
}
