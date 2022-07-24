import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { APIGatewayProxyResult } from "aws-lambda";
import { SuccessResponseModel } from '../../models/response.model';
import { handleInternalServerError } from '@libs/error-handler';

import productsService from '../../services/products.service';

export default middyfy(async (): Promise<APIGatewayProxyResult> => {
  try {
    const products = await productsService.getProducts();

    return formatJSONResponse(new SuccessResponseModel({ products }));
  } catch (error) {
    return handleInternalServerError(error);
  }
});
