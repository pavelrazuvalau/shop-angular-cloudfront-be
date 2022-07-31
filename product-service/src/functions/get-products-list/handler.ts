import { APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { handleServerError } from '@libs/handle-server-error';

import { SuccessResponseModel } from '@models/response.model';
import productsService from '@services/products.service';

export default middyfy(async (): Promise<APIGatewayProxyResult> => {
  try {
    const products = await productsService.getProducts();

    return formatJSONResponse(new SuccessResponseModel({ products }));
  } catch (error) {
    return handleServerError(error);
  }
});
