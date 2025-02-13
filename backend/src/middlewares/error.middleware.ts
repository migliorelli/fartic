import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http.error";

const errorMiddleware = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status = error.status || 500;
    const message = error.message || "Something went wrong.";

    console.log(
      `${req.method} - ${req.path} => Status: ${status}, Message: ${message}`,
    );

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
