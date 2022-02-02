export class MissingParamError extends Error {
  constructor(public param: string) {
    super(`Missing param: ${param}`);
    this.name = 'MissingParamError';
  }
}
