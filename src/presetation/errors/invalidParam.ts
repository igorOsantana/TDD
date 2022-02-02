export class InvalidParamError extends Error {
  constructor(public param: string) {
    super(`Invalid param: ${param}`);
    this.name = 'InvalidParamError';
  }
}
