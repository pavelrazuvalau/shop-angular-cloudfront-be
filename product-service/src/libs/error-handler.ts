import { InternalServerErrorResponseModel } from '../models/response.model';
import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyResult } from 'aws-lambda';

export function handleInternalServerError(error: Error): APIGatewayProxyResult {
  console.error(error);

  return formatJSONResponse(new InternalServerErrorResponseModel({ error }));
}
