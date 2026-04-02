import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Jogador: Solicita entrada em uma campanha' })
  create(@Body() createDto: CreateApplicationDto, @CurrentUser() user: any) {
    return this.applicationsService.create(createDto, user.userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Mestre: Aprova ou Rejeita uma inscrição' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationDto,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.updateStatus(id, user.userId, updateDto);
  }
}
