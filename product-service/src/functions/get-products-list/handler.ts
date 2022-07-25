import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { APIGatewayProxyResult } from 'aws-lambda';
import { SuccessResponseModel } from '../../models/response.model';

import productsService from '../../services/products.service';
import { handleServerError } from '@libs/handle-server-error';

export default middyfy(async (): Promise<APIGatewayProxyResult> => {
  try {
    const products = await productsService.getProducts();

    return formatJSONResponse(new SuccessResponseModel({ products }));
  } catch (error) {
    return handleServerError(error);
  }
});
