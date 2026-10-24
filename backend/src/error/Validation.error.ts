import { AppError } from "./App.error.js";

class ValidationError extends AppError {
  errors;

  constructor(mongooseError: any) {
    super("Validation failed!", 400); // 400 Bad Request
    const errors = Object.values(mongooseError.errors).map((value: any) => ({
      field: value.path,
      message: value.message,
      value: value.value,
    }));
    this.errors = errors;
  }
}

export { ValidationError };
