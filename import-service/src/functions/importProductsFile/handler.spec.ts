import {
  BadRequestResponseModel,
  SuccessResponseModel,
} from '@models/response.model';
import { APIGatewayProxyEvent } from 'aws-lambda';

class mockS3 {
  getSignedUrl = jest.fn().mockImplementation((_, options) => `${options.Key}`);

  constructor(public options: { region: string }) {}
}

describe('importProductsFile', () => {
  let handler: (event: Partial<APIGatewayProxyEvent>) => void;
  let mockFormatJSONResponse: jest.Mock;

  beforeEach(async () => {
    mockFormatJSONResponse = jest.fn().mockReturnValue(Promise.resolve());

    jest.mock('@libs/api-gateway', () => ({
      formatJSONResponse: mockFormatJSONResponse,
    }));

    jest.mock('@libs/lambda', () => ({
      middyfy: jest.fn().mockImplementation(handler => handler),
    }));

    jest.mock('aws-sdk', () => ({
      S3: mockS3,
    }));

    handler = (await import('./handler')).default as any;
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should return signed url for upload', async () => {
    const mockFileName = 'products.csv';

    const expectedResponse = new SuccessResponseModel({
      signedUrl: `uploaded/${mockFileName}`,
    });

    await handler({
      queryStringParameters: {
        name: mockFileName,
      },
    });

    expect(mockFormatJSONResponse).toHaveBeenCalledWith(expectedResponse);
  });

  it('should return 400 if query param is missing', async() => {
    const expectedResponse = new BadRequestResponseModel();

    await handler({});

    expect(mockFormatJSONResponse).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: expectedResponse.statusCode
    }));
  });
});
