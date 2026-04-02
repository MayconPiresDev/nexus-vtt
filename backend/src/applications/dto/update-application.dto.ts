import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto';
import { ApplicationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @ApiProperty({
    enum: ApplicationStatus,
    description: 'Novo status da inscrição',
  })
  @IsEnum(ApplicationStatus)
  @IsNotEmpty()
  status: ApplicationStatus;
}
