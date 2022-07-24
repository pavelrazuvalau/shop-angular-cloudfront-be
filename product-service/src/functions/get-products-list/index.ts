import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.default`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        description: 'Retrieves a list of all products',
        cors: true,
        responseData: {
          200: {
            description: 'Product list retrieved successfully',
            bodyType: 'ProductListResponse',
          },
        },
      },
    },
  ],
};
