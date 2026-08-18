export type SuccessResult<T> = {
  readonly success: true;
  readonly data: T;
};

export type ErrorResult<E = string> = {
  readonly success: false;
  readonly error: E;
  readonly issues?: string[];
};

export type Result<T, E = string> = SuccessResult<T> | ErrorResult<E>;

export function success<T>(data: T): SuccessResult<T> {
  return { success: true, data };
}

export function error<E = string>(cause: E, issues?: string[]): ErrorResult<E> {
  return { success: false, error: cause, issues };
}
