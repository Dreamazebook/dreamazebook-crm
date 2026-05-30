export function logApiError({
  error,
  context,
  ...meta
}: {
  error: unknown;
  context?: string;
  [key: string]: unknown;
}) {
  const formattedError =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;

  const payload = context
    ? { context, error: formattedError, ...meta }
    : { error: formattedError, ...meta };

  console.error('[API ERROR]', payload);
}
