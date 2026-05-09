import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
  ParseFilePipe,
  UseInterceptors,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.charactersService.remove(id, user.userId);
  }

  @Patch(':id/avatar')
  @ApiOperation({ summary: 'Fazer upload da imagem do personagem' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/characters',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const avatarUrl = `/uploads/characters/${file.filename}`;

    // O "as UpdateCharacterDto" diz ao TypeScript: "Confia em mim, eu sei o que estou a fazer!"
    return this.charactersService.update(id, user.userId, {
      avatarUrl,
    } as UpdateCharacterDto);
  }
}
