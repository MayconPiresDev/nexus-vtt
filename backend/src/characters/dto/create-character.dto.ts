import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateCharacterDto {
  @ApiProperty({ example: 'Gandalf', description: 'Nome do personagem' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Maia', description: 'Raça do personagem' })
  @IsString()
  @IsNotEmpty()
  race: string;

  @ApiProperty({ example: 'Wizard', description: 'Classe principal' })
  @IsString()
  @IsNotEmpty()
  charClass: string;

  // Atributos base (D&D style: 1 a 30)
  @ApiProperty({ example: 10 }) @IsInt() @Min(1) @Max(30) strength: number;
  @ApiProperty({ example: 14 }) @IsInt() @Min(1) @Max(30) dexterity: number;
  @ApiProperty({ example: 14 }) @IsInt() @Min(1) @Max(30) constitution: number;
  @ApiProperty({ example: 20 }) @IsInt() @Min(1) @Max(30) intelligence: number;
  @ApiProperty({ example: 20 }) @IsInt() @Min(1) @Max(30) wisdom: number;
  @ApiProperty({ example: 18 }) @IsInt() @Min(1) @Max(30) charisma: number;
}
