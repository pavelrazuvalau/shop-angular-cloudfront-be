import { S3 } from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import CsvParser from 'csv-parser';
import { CsvParseError } from '@libs/custom-errors';
import { formatJSONResponse } from '@libs/api-gateway';
import { BadRequestResponseModel, SuccessResponseModel } from '@models/response.model';
import { handleServerError } from '@libs/handle-server-error';

const s3 = new S3({ region: 'eu-west-1' });

export default async function(event: S3Event) {
  try {
    const results = await Promise.all(event.Records.map(async (record) => {
      const fileName = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
      const { name: bucketName } = record.s3.bucket;

      const csvFileRequest = s3.getObject({
        Bucket: bucketName,
        Key: fileName,
      });

      const parsedResults = await new Promise<string>((resolve, reject) => {
        const resultChunks = [];

        csvFileRequest.createReadStream()
          .pipe(CsvParser())
          .on('data', (data) => resultChunks.push(data))
          .on('end', () => resolve(JSON.stringify(resultChunks)))
          .on('error', () => reject(new CsvParseError('CSV parse error')));
      });

      const parsedResultsJson = Buffer.from(parsedResults);
      const parsedPath = `parsed/${fileName.split('/').slice(1).join('/')}`;

      await s3.upload({
        Bucket: bucketName,
        Key: parsedPath.replace('csv', 'json'),
        ContentType: 'application/json',
        Body: parsedResultsJson,
      }).promise();

      console.log('Parsed JSON file uploaded to parsed/');

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

    console.log('Parsed results: ', results);

    return formatJSONResponse(new SuccessResponseModel({ results }))
  } catch (error) {
    if (error instanceof CsvParseError) {
      return formatJSONResponse(new BadRequestResponseModel({ error: error.message }));
    }

    return handleServerError(error);
  }
}
