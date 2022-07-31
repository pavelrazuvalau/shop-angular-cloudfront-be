export interface ResponseModel {
  body?: any;
  statusCode?: number;
}

class BaseResponseModel implements ResponseModel {
  constructor(public body?: any) {}
}

export class SuccessResponseModel extends BaseResponseModel {
  statusCode = 200;
}

export class BadRequestResponseModel extends BaseResponseModel {
  statusCode = 400;
}

export class NotFoundResponseModel extends BaseResponseModel {
  statusCode = 404;
}

export class InternalServerErrorResponseModel extends BaseResponseModel {
  statusCode = 500;
}
