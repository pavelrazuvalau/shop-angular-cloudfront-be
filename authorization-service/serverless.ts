import type { AWS } from '@serverless/typescript';

import { basicAuthorizer } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { basicAuthorizer },
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
  },
  resources: {
    Outputs: {
      BasicAuthorizerArn: {
        Description: 'Basic authorizer lambda ARN',
        Value: { 'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'] },
        Export: {
          Name: { 'Fn::Sub': '${AWS::StackName}-BasicAuthorizerArn' },
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
