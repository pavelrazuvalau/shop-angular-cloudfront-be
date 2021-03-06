import { productsMock } from '@mocks/products.mock';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { NotFoundResponseModel, SuccessResponseModel } from '@models/response.model';
import { ProductDetails } from '../../types/products';

describe('getProductsById', () => {
  let mockFormatJSONResponse: jest.Mock;
  let handler: (event: Partial<APIGatewayProxyEvent>) => void;

  let expectedProduct: ProductDetails | undefined;

  beforeEach(async () => {
    mockFormatJSONResponse = jest.fn().mockReturnValue(Promise.resolve())

    jest.mock('@services/products.service', () => ({
      getProductById: () => expectedProduct
    }));
    jest.mock('@libs/api-gateway', () => ({
      formatJSONResponse: mockFormatJSONResponse,
    }));

    jest.mock('@libs/lambda', () => ({
      middyfy: jest.fn().mockImplementation(handler => handler),
    }));

    handler = (await import('./handler')).default as any;
  });

  afterEach(() => {
    jest.resetModules();

    expectedProduct = undefined;
  });

  it('should format json response with product found by id', async () => {
    expectedProduct = productsMock[1];

    await handler({
      pathParameters: {
        productId: expectedProduct.id,
      },
    });

    expect(mockFormatJSONResponse).toBeCalledWith(new SuccessResponseModel({ product: expectedProduct }));
  });

  it('should return 404 in case if product not found', async () => {
    await handler({
      pathParameters: {
        productId: 'lalala',
      },
    });

    expect(mockFormatJSONResponse).toBeCalledWith(new NotFoundResponseModel());
  });
});
