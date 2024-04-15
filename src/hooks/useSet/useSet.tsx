import { extendObjectWithProperties } from "@/utils/extendObjectWithProperties";
import { useCallback, useState } from "react";

interface ImmutableSet<T> extends ReadonlySet<T> {
  add: (...value: T[]) => ImmutableSet<T>;
  clear: () => ImmutableSet<T>;
  delete: (...value: T[]) => ImmutableSet<T>;
  toggle: (...value: T[]) => ImmutableSet<T>;
}

function useSet<T>(initialItems: T[] = []): ImmutableSet<T> {
  const [collection, setCollection] = useState<ReadonlySet<T>>(
    new Set<T>(initialItems)
  );

  const add: ImmutableSet<T>["add"] = (...value) => {
    setCollection((prev) =>
      value.map((v) => prev.has(v)).every(Boolean)
        ? prev
        : new Set([...Array.from(prev), ...value])
    );
    return collection as ImmutableSet<T>;
  };

  const clear: ImmutableSet<T>["clear"] = () => {
    setCollection((prev) => (prev.size === 0 ? prev : new Set()));
    return collection as ImmutableSet<T>;
  };

  const deleteFn: ImmutableSet<T>["delete"] = (...value) => {
    setCollection((prev) =>
      value.map((v) => prev.has(v)).some(Boolean)
        ? new Set(Array.from(prev).filter((v) => !value.includes(v)))
        : prev
    );
    return collection as ImmutableSet<T>;
  };

  const toggle: ImmutableSet<T>["toggle"] = (...value) => {
    setCollection((prev) => {
      const valuesToAdd = value.filter((v) => !prev.has(v));
      const valuesToDelete = value.filter((v) => prev.has(v));
      return new Set(
        Array.from(prev)
          .filter((v) => valuesToDelete.includes(v))
          .concat(valuesToAdd)
      );
    });
    return collection as ImmutableSet<T>;
  };

  const immutableMap = extendObjectWithProperties(
    collection,
    {
      add: useCallback(add, [collection]),
      clear: useCallback(clear, [collection]),
      delete: useCallback(deleteFn, [collection]),
      toggle: useCallback(toggle, [collection]),
    },
    { enumerable: false }
  );

  return immutableMap;
}

export { useSet };
