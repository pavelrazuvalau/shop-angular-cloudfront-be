import { AuthPolicyEffect } from '../constants/auth';
import { APIGatewayAuthorizerResult } from 'aws-lambda/trigger/api-gateway-authorizer';

export default function(principalId: string, resource: string, effect: AuthPolicyEffect): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        }
      ]
    }
  }
}
