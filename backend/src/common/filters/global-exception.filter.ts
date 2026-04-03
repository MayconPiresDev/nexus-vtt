import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch() // O parêntesis vazio significa: "Apanha TODOS os erros que acontecerem na API"
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno no servidor.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = (exceptionResponse as any).message || exception.message;
    }
    // 2. Se for um erro do Prisma (Base de Dados)
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': // Erro de campo único (Unique Constraint)
          status = HttpStatus.CONFLICT;
          message =
            'Já existe um registo com estes dados únicos no sistema (ex: e-mail já em uso).';
          break;
        case 'P2025': // Registo não encontrado ao tentar atualizar/apagar
          status = HttpStatus.NOT_FOUND;
          message = 'O registo que tentou alterar ou apagar não existe.';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Erro ao processar a operação na base de dados.';
          break;
      }
    } else {
      console.error('🔥 [Erro Global Não Tratado]:', exception);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
    });
  }
}
