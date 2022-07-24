import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.default`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        description: 'Retrieves product details by ID',
        cors: true,
        responseData: {
          200: {
            description: 'Product retrieved successfully',
            bodyType: 'ProductDetailsResponse',
          },
          404: 'Product not found',
        },
      },
    },
  ],
};
