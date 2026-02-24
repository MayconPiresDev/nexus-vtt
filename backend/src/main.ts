import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
      .setTitle('Nexus VTT - API')
      .setDescription('O coração do nosso RPG Virtual Tabletop')
      .setVersion('1.0')
      .addTag('users')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor rodando em: http://localhost:3000`);
  console.log(`📄 Documentação em: http://localhost:3000/api`);

}
bootstrap();
