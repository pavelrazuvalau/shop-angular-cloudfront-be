import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.default`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        description: 'Created a new product',
        cors: true,
        bodyType: 'BaseProduct',
        responseData: {
          200: {
            description: 'Product retrieved successfully',
            bodyType: 'ProductDetailsResponse',
          },
          400: 'Product info posted is invalid',
          500: 'Internal server error occurred',
        },
      },
    },
  ],
};
