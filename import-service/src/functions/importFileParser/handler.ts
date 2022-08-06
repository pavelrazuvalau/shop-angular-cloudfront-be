import { S3, SQS } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import CsvParser from 'csv-parser';
import { CsvParseError } from '@libs/custom-errors';
import { formatJSONResponse } from '@libs/api-gateway';
import { BadRequestResponseModel, SuccessResponseModel } from '@models/response.model';
import { handleServerError } from '@libs/handle-server-error';

const { SQS_QUEUE_NAME } = process.env;

const s3 = new S3({ region: 'eu-west-1' });
const sqs = new SQS({ region: 'eu-west-1' });

async function sendToSQS(products: any[]): Promise<void> {
  const queueUrlResponse = await sqs.getQueueUrl({ QueueName: SQS_QUEUE_NAME }).promise();
  const queueUrl = queueUrlResponse.QueueUrl;

  await sqs.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(products)
  }).promise();
}

export default async function(event: S3Event) {
  try {
    const results = await Promise.all(event.Records.map(async (record) => {
      const fileName = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
      const { name: bucketName } = record.s3.bucket;

      const csvFileRequest = s3.getObject({
        Bucket: bucketName,
        Key: fileName,
      });

      const parsedResults = await new Promise<any[]>((resolve, reject) => {
        const resultChunks = [];

        csvFileRequest.createReadStream()
          .pipe(CsvParser())
          .on('data', (data) => {
            const handledIncomingData = {};
            const keys = Object.keys(data);

            keys.forEach(key => {
              const numericValue =  Number(data[key]);

              handledIncomingData[key] = Number.isNaN(numericValue) ? data[key] : numericValue;
            });

            resultChunks.push(handledIncomingData);
          })
          .on('end', () => resolve(resultChunks))
          .on('error', () => reject(new CsvParseError('CSV parse error')));
      });

      const parsedPath = `parsed/${fileName.split('/').slice(1).join('/')}`;

      await s3.copyObject({
        Bucket: bucketName,
        CopySource: `${bucketName}/${fileName}`,
        Key: parsedPath,
      }).promise();

      console.log('Source CSV file copied to parsed/');

      await s3.deleteObject({
        Bucket: bucketName,
        Key: fileName,
      }).promise();

      console.log('Source CSV file removed from uploaded/');

      return parsedResults;
    }));

    const allParsedProducts = results.flat();

    await sendToSQS(allParsedProducts);

    console.log('Sent message to SQS with products: ', allParsedProducts);

    return formatJSONResponse(new SuccessResponseModel({ results: allParsedProducts }))
  } catch (error) {
    if (error instanceof CsvParseError) {
      return formatJSONResponse(new BadRequestResponseModel({ error: error.message }));
    }

    return handleServerError(error);
  }
}
