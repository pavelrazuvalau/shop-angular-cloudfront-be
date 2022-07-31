import { APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { InternalServerErrorResponseModel } from '../models/response.model';

export function handleServerError(error: Error): APIGatewayProxyResult {
  console.error(error);

  return formatJSONResponse(new InternalServerErrorResponseModel({ error: error.message }));
}
