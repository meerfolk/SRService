export const anyToError = (error: any): Error => {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
}