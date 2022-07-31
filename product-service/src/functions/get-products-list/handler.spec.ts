import { productsMock } from '@mocks/products.mock';
import { SuccessResponseModel } from '@models/response.model';

describe('getProductsList', () => {
  let mockFormatJSONResponse: jest.Mock;

  beforeEach(async () => {
    mockFormatJSONResponse = jest.fn().mockReturnValue(Promise.resolve())

    jest.mock('@services/products.service', () => ({
      getProducts: () => productsMock
    }));
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
    expect(mockFormatJSONResponse).toBeCalledWith(new SuccessResponseModel({ products: productsMock } ));
  })
});
