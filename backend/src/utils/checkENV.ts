import "dotenv/config";

export const isProduction = () => process.env.NODE_ENV === "production";
export const isNotProduction = () => process.env.NODE_ENV !== "production";

export const isDevelopment = () => process.env.NODE_ENV === "development";
export const isNotDevelopment = () => process.env.NODE_ENV !== "development";

type EnvVariables<T> = {
  [K in keyof T]: string;
};
export const envERROR = <T extends Record<string, string | undefined>>(
  env: T,
): EnvVariables<T> => {
  for (const [name, value] of Object.entries(env)) {
    if (!value) {
      console.error(`ENVERROR: Environment variable "${name}" is missing.`);
      throw new Error(`ENVERROR: Environment variable "${name}" is missing.`);
    }
  }

  return env as EnvVariables<T>;
};
