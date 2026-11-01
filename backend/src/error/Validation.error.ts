// import { AppError } from "./App.error.js";

// class ValidationError extends AppError {
//   errors;

//   constructor(mongooseError: any) {
//     super("Validation failed!", 422);
//     const errors = Object.values(mongooseError.errors).map((value: any) => ({
//       field: value.path,
//       message: value.message,
//       value: value.value,
//     }));
//     this.errors = errors;
//   }
// }

// export { ValidationError };

import { AppError } from "./App.error.js";

class ValidationError extends AppError {
  errors: Record<string, string>;

  constructor(mongooseError: any) {
    super("Please check your input fields", 422);

    this.errors = Object.fromEntries(
      Object.values(mongooseError.errors).map((value: any) => [
        value.path,
        value.message,
      ]),
    );
  }
}

export { ValidationError };
