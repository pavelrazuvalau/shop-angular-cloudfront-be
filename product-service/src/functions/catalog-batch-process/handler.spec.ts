import { SQSBatchResponse } from 'aws-lambda';
import { productsMock } from '@mocks/products.mock';
import { SQSRecord } from 'aws-lambda/trigger/sqs';

const mockCreateProducts = jest.fn().mockReturnValue(Promise.resolve(productsMock));;
const mockPublish = jest.fn().mockReturnValue({ promise: () => Promise.resolve() });

class mockSNS {
  publish = mockPublish;

  constructor(public options: { region: string }) {}
}

describe('catalogBatchProcess', () => {
  const env = process.env;

  let handler: (event: { Records: Array<Partial<SQSRecord>> }) => Promise<SQSBatchResponse>;

  beforeEach(async () => {
    process.env = {
      ...env,
      SNS_ARN: 'mockArn',
    }

    jest.mock('@services/products.service', () => ({
      createBatchOfProducts: mockCreateProducts
    }));

    jest.mock('aws-sdk', () => ({
      SNS: mockSNS,
    }));

    handler = (await import('./handler')).default;
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    process.env = env;
  });

  it('should handle message successfully and send SNS notification', async () => {
    const expectedMessagePayload = {
      Subject: 'New products parsed',
      Message: `The following products have been added: \n\n ${JSON.stringify(productsMock, null, 2)}`,
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        overallStockCount: {
          DataType: "Number",
          StringValue: `${productsMock.reduce((acc, current) => acc + current.count, 0)}`,
        }
      },
    };
    const expectedHandlerResult = {
      batchItemFailures: [],
    };

    const handlerResult = await handler({
      Records: [
        {
          messageId: '1',
          body: JSON.stringify(productsMock)
        }
      ]
    });

    expect(expectedHandlerResult).toEqual(handlerResult);
    expect(mockPublish).toHaveBeenCalledWith(expectedMessagePayload);
  });

  it('should mark error is one of products is invalid', async () => {
    const expectedHandlerResult = {
      batchItemFailures: [
        { itemIdentifier: '1' }
      ],
    };

    const handlerResult = await handler({
      Records: [
        {
          messageId: '1',
          body: JSON.stringify(productsMock.concat({} as any))
        }
      ]
    });

    expect(expectedHandlerResult).toEqual(handlerResult);
  });

  it('should mark error in case of product creation error', async () => {
    mockCreateProducts.mockReturnValue(Promise.reject());

    const expectedHandlerResult = {
      batchItemFailures: [
        { itemIdentifier: '1' }
      ],
    };

    const handlerResult = await handler({
      Records: [
        {
          messageId: '1',
          body: JSON.stringify(productsMock)
        }
      ]
    });

    expect(expectedHandlerResult).toEqual(handlerResult);
  });
});
