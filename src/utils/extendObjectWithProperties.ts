export function extendObjectWithProperties<T, P extends Record<string, any>>(
  targetObject: T,
  properties: P,
  config: {
    enumerable?: boolean;
    writable?: boolean;
    configurable?: boolean;
  } = {
    enumerable: true,
    writable: true,
    configurable: true,
  }
): T & P {
  return Object.defineProperties(
    targetObject,
    Object.getOwnPropertyNames(properties).reduce(
      (acc: { [key: string]: {} }, key) => {
        acc[key] = {
          enumerable: config.enumerable,
          writable: config.writable,
          configurable: config.configurable,
          value: properties[key],
        };
        return acc;
      },
      {}
    )
  ) as T & P;
}
