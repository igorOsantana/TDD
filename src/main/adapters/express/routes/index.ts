import { Controller, HttpRequest } from '../../../../presetation/protocols';
import { Request, Response } from 'express';

export const adapterRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpReq: HttpRequest = {
      body: req.body,
    };
    const httpRes = await controller.handle(httpReq);
    if (httpRes.statusCode === 200) {
      res.status(httpRes.statusCode).json(httpRes.body);
    } else {
      res.status(httpRes.statusCode).json({
        error: httpRes.body.message,
      });
    }
  };
};
