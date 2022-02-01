export class SignUpController {
  handle(httpReq: any): any {
    return {
      statusCode: 400,
      body: new Error('Missing name in request body'),
    };
  }
}
