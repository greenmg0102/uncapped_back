import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetFileUrl = createParamDecorator(
    (_: undefined, context: ExecutionContext): string => {
        const request = context.switchToHttp().getRequest();
        return request.fileUrl;
    },
);