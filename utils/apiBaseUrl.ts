const PROD_API_ORIGIN = 'https://api.dreamazebook.com';
const DEV_API_ORIGIN = 'https://dev-api.dreamazebook.com';

const normalizeApiBaseUrl = (value: string) => value.replace(/\/+$/, '');

const isProductionRuntime = () => {
  const publicEnv =
    process.env.NEXT_PUBLIC_APP_ENV ||
    process.env.NEXT_PUBLIC_ENV ||
    process.env.NEXT_PUBLIC_VERCEL_ENV;
  const deployEnv = publicEnv || process.env.VERCEL_ENV || process.env.NODE_ENV;

  return deployEnv === 'production';
};

export const getDefaultApiOrigin = () => (isProductionRuntime() ? PROD_API_ORIGIN : DEV_API_ORIGIN);

export const getApiBaseUrl = () =>
  normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL || `${getDefaultApiOrigin()}/api`);

export const getApiOrigin = () => {
  try {
    return new URL(getApiBaseUrl()).origin;
  } catch {
    return getDefaultApiOrigin();
  }
};
