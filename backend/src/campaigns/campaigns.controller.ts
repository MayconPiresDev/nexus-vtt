import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova campanha (Apenas MASTER ou BOTH)' })
  create(
    @Body() createCampaignDto: CreateCampaignDto,
    @CurrentUser() user: any,
  ) {
    // A Barreira de Segurança: O usuário tem permissão?
    if (user.role === 'PLAYER') {
      throw new ForbiddenException(
        'Apenas Mestres podem criar novas campanhas no Nexus VTT!',
      );
    }

    return this.campaignsService.create(createCampaignDto, user.userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar campanhas (Mestre vê as suas, Jogador vê as abertas)',
  })
  findAll(@CurrentUser() user: any) {
    return this.campaignsService.findAll(user.userId, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar dados da campanha (Apenas o Mestre criador)',
  })
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @CurrentUser() user: any,
  ) {
    return this.campaignsService.update(id, user.userId, updateCampaignDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma campanha (Apenas o Mestre criador)' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.campaignsService.remove(id, user.userId);
  }
}
