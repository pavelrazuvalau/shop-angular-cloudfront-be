import { middyfy } from "@libs/lambda";
import products from "@mocks/products.mock.json";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";

export default middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters.productId;
  const product = products.find(product => product.id === productId);

  const statusCode = !!product ? 200 : 404;

  return formatJSONResponse({
    statusCode,
    ...!!product && { body: { product } }
  });
});
