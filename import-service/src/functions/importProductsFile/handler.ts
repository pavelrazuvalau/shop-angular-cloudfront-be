import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk';

// I tried several ways of organizing shared module, including separate npm package or specifying path in tsconfig,
// but all attempts are not successful due to compilation or runtime errors
// TODO: organize shared ts package
import { middyfy } from '@libs/lambda';
import { ValidationError } from '@libs/custom-errors';
import { formatJSONResponse } from '@libs/api-gateway';
import { handleServerError } from '@libs/handle-server-error';
import { BadRequestResponseModel, SuccessResponseModel } from '@models/response.model';

const s3 = new S3({ region: 'eu-west-1' });

export default middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const fileName = event.queryStringParameters?.name;

    if (!fileName) {
      throw new ValidationError('Missing required query param "name"');
    }

    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: 'pc-expert-products',
      Key: `uploaded/${fileName}`,
      Expires: 60,
      ContentType: 'text/csv',
    })

    return formatJSONResponse(new SuccessResponseModel({ signedUrl }));
  } catch (error) {
    if (error instanceof ValidationError) {
      return formatJSONResponse(new BadRequestResponseModel({ error: error.message }))
    }

    return handleServerError(error);
  }
});
