import { SQSBatchResponse, SQSEvent } from 'aws-lambda';
import { SQSRecord } from 'aws-lambda/trigger/sqs';
import { SNS } from 'aws-sdk';
import productsService from '@services/products.service';
import validate from '@libs/product-validator';

const { SNS_ARN } = process.env;
const sns = new SNS({ region: 'eu-west-1' });

export default async function(event: SQSEvent): Promise<SQSBatchResponse> {
  const failedRecords: SQSRecord[] = [];

  await Promise.all(event.Records.map(async record => {
    try {
      const products = JSON.parse(record.body);

      console.log('Validating products', products);

      await Promise.all(products.map(product => validate(product)));

      console.log('Creating products in DB');

      const createdProducts = await productsService.createBatchOfProducts(products);

      console.log('Sending SNS notification');

      await sns.publish({
        Subject: 'New products parsed',
        Message: `The following products have been added: \n\n ${JSON.stringify(createdProducts, null, 2)}`,
        TopicArn: SNS_ARN,
      }).promise();

      console.log('Send SNS notification for event ', record);
    } catch (error) {
      console.log('Error occurred while processing the record: ', error, record);
      failedRecords.push(record);
    }
  }));

  return {
    batchItemFailures: failedRecords.map(record => ({ itemIdentifier: record.messageId }))
  }
}
