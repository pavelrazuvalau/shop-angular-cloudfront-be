import { middyfy } from "@libs/lambda";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { NotFoundResponseModel, SuccessResponseModel } from '../../models/response.model';
import productsService from '../../services/products.service';
import { handleInternalServerError } from '@libs/error-handler';

export default middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters.productId;
  try {
    const product = await productsService.getProductById(productId);

    const response = !!product
      ? new SuccessResponseModel({ product })
      : new NotFoundResponseModel();

    return formatJSONResponse(response);
  } catch (error) {
    return handleInternalServerError(error);
  }
});
