import { createParamDecorator } from '@nestjs/common';

export const AuthFilter = createParamDecorator((data, req) => {
  let where = {};
  if (req.user && !req.user.role) {
    where = {
      userId: Number(req.user.id),
    };
  }
  return where;
});
