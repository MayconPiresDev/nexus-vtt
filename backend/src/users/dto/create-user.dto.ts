import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
    PLAYER = 'PLAYER',
    MASTER = 'MASTER',
}

export class CreateUserDto {
    @ApiProperty({ example: 'Elden Lord', description: 'Nome de exibição do usuário' })
    @IsString()
    @IsNotEmpty({ message: 'O nome não pode estar vazio' })
    name: string;

    @ApiProperty({ example: 'player@nexusvtt.com', description: 'E-mail para login' })
    @IsEmail({}, { message: 'E-mail inválido' })
    email: string;

    @ApiProperty({ example: 'senha123', description: 'Senha (mínimo 6 caracteres)' })
    @IsString()
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    password: string;

    @ApiProperty({ enum: UserRole, default: UserRole.PLAYER })
    @IsEnum(UserRole)
    role?: UserRole;
}
