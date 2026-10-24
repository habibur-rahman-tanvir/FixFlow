import { AppError } from "./App.error.js";

class CastError extends AppError {
  errors;

  constructor(mongooseError: any) {
    const message = `Invalid ${mongooseError.path}: ${mongooseError.value}`;
    super(message, 400);
    const err = [
      {
        name: mongooseError.name,
        path: mongooseError.path,
        value: mongooseError.value,
      },
    ];
    this.errors = err;
  }
}

export { CastError };
