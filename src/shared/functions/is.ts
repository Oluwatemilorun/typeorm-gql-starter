export function isObject(obj: unknown): obj is object {
  return obj != null && obj?.constructor?.name === 'Object';
}

export function isString(val: unknown): val is string {
  return val != null && typeof val === 'string';
}

export function isDate(value: unknown): value is Date {
  const date = new Date(value as never);
  return !isNaN(date.valueOf());
}
