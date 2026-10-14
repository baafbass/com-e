/** Extracts a human-readable message from an API error. */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.message ?? (error?.request ? 'Cannot reach the server. Check your connection.' : fallback);

/** Converts API validation details into a `{ field: message }` map for forms. */
export const getFieldErrors = (error) =>
  Object.fromEntries((error?.response?.data?.details ?? []).map(({ field, message }) => [field, message]));
