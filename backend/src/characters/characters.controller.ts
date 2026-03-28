import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateCharacterDto } from './dto/update-character.dto';

@ApiTags('characters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Proteção Total do Módulo
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova ficha de personagem' })
  create(
    @Body() createCharacterDto: CreateCharacterDto,
    @CurrentUser() user: any,
  ) {
    return this.charactersService.create(createCharacterDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as fichas do usuário logado' })
  findAll(@CurrentUser() user: any) {
    return this.charactersService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma ficha específica do usuário logado' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.charactersService.findOne(id, user.userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar dados de uma ficha (Apenas o dono consegue)',
  })
  update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @CurrentUser() user: any,
  ) {
    return this.charactersService.update(id, user.userId, updateCharacterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma ficha (Apenas o dono consegue)' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.charactersService.remove(id, user.userId);
  }
}
