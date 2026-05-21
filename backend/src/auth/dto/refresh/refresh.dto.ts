import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description: 'O Refresh Token de 7 dias do usuário',
    example: 'eyJhbGciOiJIUz...',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
