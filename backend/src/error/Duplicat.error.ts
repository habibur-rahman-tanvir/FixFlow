import { AppError } from "./App.error.js";

class DuplicatError extends AppError {
  errors;

  constructor(mongooseError: any) {
    super("Already exists", 409);
    const errors = Object.entries(mongooseError.keyValue).map(
      ([field, value]) => ({
        field,
        message: `${field} already exist`,
        value,
      }),
    );
    this.errors = errors;
  }
}

export { DuplicatError };
