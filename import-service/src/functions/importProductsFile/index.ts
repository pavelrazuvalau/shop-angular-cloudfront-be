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
        authorizer: {
          name: 'basicAuthorizer',
          arn: { 'Fn::ImportValue': { 'Fn::Sub': '${AuthServiceName}-BasicAuthorizerArn' } },
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
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
          401: 'Basic auth token is not provided',
          403: 'Invalid username or password',
          500: 'Internal server error occurred',
        },
      },
    },
  ],
};
