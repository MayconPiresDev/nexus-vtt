import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // Pegamos a requisição atual
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Se passarmos um dado específico (ex: @CurrentUser('email')), ele retorna só o email
    // Caso contrário, retorna o objeto inteiro (id, email, role)
    return data ? user?.[data] : user;
  },
);
