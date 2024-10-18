import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserInfor = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return key ? user?.[key] : user
  },
);