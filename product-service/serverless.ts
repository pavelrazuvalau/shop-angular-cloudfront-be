import type { AWS } from '@serverless/typescript';

import envCredentials from './env';

import { getProductsList, getProductsById, createProduct, catalogBatchProcess } from '@functions/.';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    region: 'eu-west-1',
    stage: 'dev',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SNS_ARN: { Ref: 'SNSTopic' },
      ...envCredentials,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: { Ref: 'SNSTopic' },
      }
    ],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: envCredentials.SQS_QUEUE_NAME,
          RedrivePolicy: {
            deadLetterTargetArn: { 'Fn::GetAtt': ['DeadLetterSQSQueue', 'Arn'] },
            maxReceiveCount: 5
          },
        }
      },
      DeadLetterSQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: envCredentials.SQS_DL_QUEUE_NAME,
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: envCredentials.SNS_PRODUCT_TOPIC,
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: envCredentials.SNS_NOTIFICATION_EMAIL,
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            overallStockCount: [{ "numeric": [ "<", 1000 ] }]
          }
        }
      },
      HighStockSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: envCredentials.SNS_SECONDARY_NOTIFICATION_EMAIL,
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            overallStockCount: [{ "numeric": [ ">=", 1000 ] }]
          }
        }
      },
    }
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      title: 'Products Service',
      typefiles: ['./src/types/products.d.ts',],
      schemes: ['https'],
      apiType: 'http',
      basePath: '/dev',
    }
  },
};

module.exports = serverlessConfiguration;
