import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'player@nexusvtt.com',
        description: 'E-mail cadastrado do usuário'
    })
    @IsEmail({}, { message: 'E-mail inválido' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'senha123',
        description: 'Senha de acesso'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string;
}