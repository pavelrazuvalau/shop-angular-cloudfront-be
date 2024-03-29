import type { AWS } from '@serverless/typescript';
import { importProductsFile, importFileParser } from '@functions/index';
import env from './env';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      ...env
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: ['arn:aws:s3:::pc-expert-products']
      },
      {
        Effect: 'Allow',
        Action: ['s3:GetObject', 's3:PutObject', 's3:CopyObject', 's3:DeleteObject'],
        Resource: ['arn:aws:s3:::pc-expert-products/*']
      },
      {
        Effect: 'Allow',
        Action: ['sqs:GetQueueUrl', 'sqs:SendMessage'],
        Resource: [
          { 'Fn::Join': [':', ['arn:aws:sqs', { Ref: 'AWS::Region' }, { Ref: 'AWS::AccountId' }, env.SQS_QUEUE_NAME]] }
        ]
      }
    ]
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  resources: {
    Parameters: {
      AuthServiceName: {
        Type: 'String',
        Default: env.AUTH_SERVICE_NAME
      }
    },
    Resources: {
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      GatewayResponseDefault5XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_5XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      title: 'Import Service',
      typefiles: ['./src/types/types.d.ts',],
      schemes: ['https'],
      apiType: 'http',
      basePath: '/dev',
    },
  },
};

module.exports = serverlessConfiguration;
