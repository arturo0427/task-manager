import 'dotenv/config';

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

const parseBoolean = (
  value: string | undefined,
  fallback: boolean,
): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

export const envConfig = {
  port: parseNumber(process.env.PORT, 3000),
  jwtSecret: process.env.JWT_SECRET ?? 'change-this-jwt-secret',
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseNumber(process.env.DB_PORT, 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'encuba_tasks',
    synchronize: parseBoolean(process.env.DB_SYNCHRONIZE, true),
  },
};
