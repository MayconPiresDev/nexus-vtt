import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID da campanha',
  })
  @IsUUID()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({ description: 'ID do Personagem (Ficha) que vai jogar' })
  @IsUUID()
  @IsNotEmpty()
  characterId: string;
}
