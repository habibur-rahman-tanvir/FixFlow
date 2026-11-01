import { AppError } from "./App.error.js";

export type FieldErrors = Record<string, string>;

class FieldsError extends AppError {
  errors: FieldErrors;

  constructor(
    errors: FieldErrors,
    message = "Please review the highlighted fields and try again.",
    statusCode = 422,
  ) {
    super(message, statusCode);
    this.errors = errors;
  }
}

export { FieldsError };
