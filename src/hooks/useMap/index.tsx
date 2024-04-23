export { useMap };

import { extendObjectWithProperties } from "@/utils/extendObjectWithProperties";
import { useCallback, useState } from "react";

interface ImmutableMap<K, V> extends ReadonlyMap<K, V> {
  clear: () => ImmutableMap<K, V>;
  delete: (...key: K[]) => ImmutableMap<K, V>;
  set: (key: K, value: V) => ImmutableMap<K, V>;
  map: <T>(callback: (value: V, key: K) => T) => T[];
  // filter: <T>(callback: (value: V, key: K) => boolean) => T[];
}

function useMap<K, V>(initialItems: [K, V][] = []): ImmutableMap<K, V> {
  const [collection, setCollection] = useState<ReadonlyMap<K, V>>(
    new Map(initialItems)
  );

  const clear: ImmutableMap<K, V>["clear"] = () => {
    setCollection((prev) => {
      return prev.size === 0 ? prev : new Map();
    });
    return collection as ImmutableMap<K, V>;
  };

  const deleteFn: ImmutableMap<K, V>["delete"] = (...keys) => {
    setCollection((prev) => {
      return keys.map((key) => prev.has(key)).some(Boolean)
        ? new Map(Array.from(prev).filter(([k, v]) => !keys.includes(k)))
        : prev;
    });
    return collection as ImmutableMap<K, V>;
  };

  const set: ImmutableMap<K, V>["set"] = (key, value) => {
    setCollection((prev) => {
      return prev.get(key) === value
        ? prev
        : new Map([...Array.from(prev), [key, value]]);
    });
    return collection as ImmutableMap<K, V>;
  };

  const map: ImmutableMap<K, V>["map"] = (callback) => {
    const mappedResult = [];
    for (const [k, v] of collection) {
      mappedResult.push(callback(v, k));
    }
    return mappedResult;
  };

  const immutableMap: ImmutableMap<K, V> = extendObjectWithProperties(
    collection,
    {
      clear: useCallback(clear, [collection]),
      delete: useCallback(deleteFn, [collection]),
      set: useCallback(set, [collection]),
      map: useCallback(map, [collection]),
    },
    { enumerable: false }
  );

  return immutableMap;
}
