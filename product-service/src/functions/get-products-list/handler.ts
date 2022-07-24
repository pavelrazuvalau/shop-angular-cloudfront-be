import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import products from '@mocks/products.mock.json';
import { APIGatewayProxyResult } from "aws-lambda";

export default middyfy(async (): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse({ body: { products } });
});
