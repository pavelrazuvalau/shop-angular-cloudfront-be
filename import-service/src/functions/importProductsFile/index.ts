import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.default`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        description: 'Gets signed url for csv file upload',
        queryStringParameters: {
          name: {
            required: true,
            type: 'string',
          },
        },
        responseData: {
          200: {
            description: 'Signed URL returned successfully',
            bodyType: 'SignedUrlResponse',
          },
          400: 'Query param "name" is missing',
          500: 'Internal server error occurred',
        },
      },
    },
  ],
};
