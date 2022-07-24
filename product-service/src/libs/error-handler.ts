import { InternalServerErrorResponseModel } from '../models/response.model';
import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyResult } from 'aws-lambda';

export function handleInternalServerError(error: Error): APIGatewayProxyResult {
  return formatJSONResponse(new InternalServerErrorResponseModel({ error }));
}
