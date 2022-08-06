import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { handleServerError } from '@libs/handle-server-error';
import { ValidationError } from '@libs/validation-error';

import validate from '@libs/product-validator';
import productsService from '@services/products.service';
import { BadRequestResponseModel, SuccessResponseModel } from '@models/response.model';

import { BaseProduct } from '../../types/products';

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
