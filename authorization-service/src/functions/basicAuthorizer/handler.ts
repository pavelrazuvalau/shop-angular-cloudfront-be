import { middyfy } from '@libs/lambda';
import { APIGatewayAuthorizerEvent } from 'aws-lambda';
import { AuthEventType, AuthPolicyEffect } from '../../constants/auth';
import generatePolicy from '@libs/generatePolicy';

export default middyfy(async (event: APIGatewayAuthorizerEvent) => {
  console.log('Incoming auth event: ', event);

  if (event.type !== AuthEventType.Token) {
    throw new Error('Invalid auth request type');
  }

  try {
    const authToken = event.authorizationToken.split(' ')[1];

    if (!authToken) {
      throw new Error('Missing token');
    }

    const [username, password] = Buffer
      .from(authToken, 'base64')
      .toString('utf-8')
      .split(':');

    console.log('User credentials: ', username, password);

    const storedPassword = process.env[username];
    const shouldAllowAccess = !!storedPassword && storedPassword === password;

    const policyEffect = shouldAllowAccess ? AuthPolicyEffect.Allow : AuthPolicyEffect.Deny;
    const authPolicy = generatePolicy(
      authToken,
      event.methodArn,
      policyEffect
    );

    console.log('Auth result: ', JSON.stringify(authPolicy));

    return authPolicy;

  } catch (error) {
    console.log('Error during authorization: ', error.message);
  }
});
