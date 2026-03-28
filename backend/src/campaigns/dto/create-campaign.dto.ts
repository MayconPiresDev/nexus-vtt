import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CampaignStatus, ExperienceLevel } from '@prisma/client';

export class CreateCampaignDto {
  @ApiProperty({ example: 'A Mina Perdida de Phandelver' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Uma aventura épica para heróis de nível 1...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: CampaignStatus,
    default: CampaignStatus.OPEN,
    required: false,
  })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiProperty({
    enum: ExperienceLevel,
    default: ExperienceLevel.NOVATO,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  minimumExp?: ExperienceLevel;
}