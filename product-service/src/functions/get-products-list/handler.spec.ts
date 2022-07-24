import { productsMock } from '@mocks/products.mock';

describe('getProductsList', () => {
  let mockFormatJSONResponse: jest.Mock;

  beforeEach(async () => {
    mockFormatJSONResponse = jest.fn().mockReturnValue(Promise.resolve())

    jest.mock('@mocks/products.mock.json', () => productsMock);
    jest.mock('@libs/api-gateway', () => ({
      formatJSONResponse: mockFormatJSONResponse,
    }));

    jest.mock('@libs/lambda', () => ({
      middyfy: jest.fn().mockImplementation(handler => handler)
    }));

    const handler = (await import('./handler')).default as any;
    await handler();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should format json response with products', () => {
    expect(mockFormatJSONResponse).toBeCalledWith({ body: { products: productsMock } });
  })
});
