import { productsMock } from '@mocks/products.mock';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('getProductsById', () => {
  let mockFormatJSONResponse: jest.Mock;
  let handler: (event: Partial<APIGatewayProxyEvent>) => void;

  beforeEach(async () => {
    mockFormatJSONResponse = jest.fn().mockReturnValue(Promise.resolve())

    jest.mock('@mocks/products.mock.json', () => productsMock);
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
  });

  it('should format json response with product found by id', async () => {
    const expectedProduct = productsMock[1];

    await handler({
      pathParameters: {
        productId: expectedProduct.id,
      },
    });

    expect(mockFormatJSONResponse).toBeCalledWith({ body: { product: expectedProduct }, statusCode: 200 });
  });

  it('should return 404 in case if product not found', async () => {
    await handler({
      pathParameters: {
        productId: 'lalala',
      },
    });

    expect(mockFormatJSONResponse).toBeCalledWith({ statusCode: 404 });
  });
});
