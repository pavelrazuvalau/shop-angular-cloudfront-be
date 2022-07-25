import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { APIGatewayProxyResult } from "aws-lambda";
import { InternalServerErrorResponseModel, SuccessResponseModel } from '../../models/response.model';

import productsService from '../../services/products.service';

export default middyfy(async (): Promise<APIGatewayProxyResult> => {
  try {
    const products = await productsService.getProducts();

    return formatJSONResponse(new SuccessResponseModel({ products }));
  } catch (error) {
    return formatJSONResponse(new InternalServerErrorResponseModel({ error: error.message }));
  }
});
