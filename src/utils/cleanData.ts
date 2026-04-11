export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  if (!obj || typeof obj !== 'object') return obj;

  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          const cleanedArray = value
            .map((v) => cleanObject(v))
            .filter((v) => v !== undefined && v !== null);

          return [key, cleanedArray.length ? cleanedArray : undefined];
        }

        if (typeof value === 'object' && value !== null) {
          const cleaned = cleanObject(value);
          return [key, Object.keys(cleaned || {}).length ? cleaned : undefined];
        }

        return [key, value];
      })
      .filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          !(typeof value === 'object' && Object.keys(value).length === 0),
      ),
  ) as Partial<T>;
}
