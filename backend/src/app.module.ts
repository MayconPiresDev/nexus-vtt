import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CharactersModule } from './characters/characters.module';
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CharactersModule, CampaignsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
