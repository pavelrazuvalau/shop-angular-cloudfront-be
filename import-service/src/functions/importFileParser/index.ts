import { handlerPath } from '@libs/handler-resolver';
import env from '../../../env';

export default {
  handler: `${handlerPath(__dirname)}/handler.default`,
  events: [
    {
      s3: {
        bucket: env.PRODUCTS_BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [{
          prefix: 'uploaded/',
        }],
        existing: true
      },
    },
  ],
};
