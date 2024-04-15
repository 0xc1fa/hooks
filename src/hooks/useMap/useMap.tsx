import { useCallback, useState } from "react";

type MutatingMapActions<K, V> = {
  clear: () => ReadonlyMapWithMutatingActions<K, V>;
  delete: (...key: K[]) => ReadonlyMapWithMutatingActions<K, V>;
  set: (key: K, value: V) => ReadonlyMapWithMutatingActions<K, V>;
  map: <T>(callback: (value: V, key: K) => T) => T[];
};

type ReadonlyMapWithMutatingActions<K, V> = ReadonlyMap<K, V> &
  MutatingMapActions<K, V>;

function useMap<K, V>(
  initialItems: [K, V][] = []
): ReadonlyMapWithMutatingActions<K, V> {
  const [collection, setCollection] = useState<ReadonlyMap<K, V>>(
    new Map<K, V>(initialItems)
  );

  const clear = useCallback((): ReadonlyMapWithMutatingActions<K, V> => {
    setCollection((prev) => {
      return prev.size === 0 ? prev : new Map();
    });
    return collection as ReadonlyMapWithMutatingActions<K, V>;
  }, []);

  const deleteFn = useCallback(
    (...keys: K[]): ReadonlyMapWithMutatingActions<K, V> => {
      setCollection((prev) => {
        return keys.map((key) => prev.has(key)).some(Boolean)
          ? new Map(Array.from(prev).filter(([k, v]) => !keys.includes(k)))
          : prev;
      });
      return collection as ReadonlyMapWithMutatingActions<K, V>;
    },
    []
  );

  const set = useCallback(
    (key: K, value: V): ReadonlyMapWithMutatingActions<K, V> => {
      setCollection((prev) => {
        return prev.get(key) === value
          ? prev
          : new Map([...Array.from(prev), [key, value]]);
      });
      return collection as ReadonlyMapWithMutatingActions<K, V>;
    },
    []
  );

  const map: <T>(callback: (value: V, key: K) => T) => T[] = useCallback(
    (callback) => {
      const mappedResult = [];
      for (const [k, v] of collection) {
        mappedResult.push(callback(v, k));
      }
      return mappedResult;
    },
    [collection]
  );

  const actions: MutatingMapActions<K, V> = {
    clear,
    delete: deleteFn,
    set,
    map,
  };

  Object.defineProperties(
    collection,
    Object.getOwnPropertyNames(actions).reduce(
      (acc: { [key: string]: {} }, key) => {
        acc[key] = {
          enumerable: false,
          value: actions[key as keyof MutatingMapActions<K, V>],
        };
        return acc;
      },
      {}
    )
  );

  // const proxy = new Proxy(collection, {
  //   get(target, prop, receiver) {
  //     if (prop in actions) {
  //       return actions[prop as keyof MutatingMapActions<K, V>];
  //     }
  //     if (typeof prop === "symbol") {
  //       return Reflect.get(target, prop, receiver);
  //     }
  //     const targetProperty = target[prop as keyof ReadonlyMap<K, V>];
  //     if (typeof targetProperty === "function") {
  //       return targetProperty.bind(target);
  //     }
  //     return targetProperty;
  //   },
  // });

  return collection as ReadonlyMapWithMutatingActions<K, V>;
}

export { useMap };
