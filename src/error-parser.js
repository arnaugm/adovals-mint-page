const parseError = (error) => {
  if (typeof error === 'string') return error;
  if (error.reason) return error.reason;
  if (error.message) return error.message;
  return JSON.stringify(error);
};

export { parseError };
