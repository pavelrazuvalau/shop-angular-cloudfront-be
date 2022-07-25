import { middyfy } from '@libs/lambda';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { handleServerError } from '@libs/handle-server-error';
import { BaseProduct } from '../../types/products';
import { ValidationError } from '@libs/validation-error';
import { BadRequestResponseModel, SuccessResponseModel } from '../../models/response.model';
import validate from '@functions/create-product/validator';
import productsService from '../../services/products.service';

export default middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const productCreationRequest: BaseProduct = event.body as any;

    await validate(productCreationRequest);

    const product = await productsService.createProduct(productCreationRequest);

    return formatJSONResponse(new SuccessResponseModel({ product }));
  } catch (error) {
    if (error instanceof ValidationError) {
      return formatJSONResponse(new BadRequestResponseModel({ error: error.message }))
    }

    return handleServerError(error);
  }
});
