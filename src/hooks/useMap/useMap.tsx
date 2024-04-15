import { useState } from "react";

type MutatingMapActions<K, V> = {
  clear: () => ReadonlyMapWithMutatingActions<K, V>;
  delete: (...key: K[]) => ReadonlyMapWithMutatingActions<K, V>;
  set: (key: K, value: V) => ReadonlyMapWithMutatingActions<K, V>;
};

type ReadonlyMapWithMutatingActions<K, V> = ReadonlyMap<K, V> &
  MutatingMapActions<K, V>;

function useMap<K, V>(
  initialItems: [K, V][] = []
): ReadonlyMapWithMutatingActions<K, V> {
  const [collection, setCollection] = useState<ReadonlyMap<K, V>>(
    new Map<K, V>(initialItems)
  );

  const actions: MutatingMapActions<K, V> = {
    clear: () => {
      setCollection(new Map());
      return proxy as ReadonlyMapWithMutatingActions<K, V>;
    },
    delete: (...value: K[]) => {
      setCollection(
        (prev) =>
          new Map(Array.from(prev).filter(([k, v]) => !value.includes(k)))
      );
      return proxy as ReadonlyMapWithMutatingActions<K, V>;
    },
    set: (key: K, value: V) => {
      setCollection((prev) => new Map([...Array.from(prev), [key, value]]));
      return proxy as ReadonlyMapWithMutatingActions<K, V>;
    },
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

  const proxy = new Proxy(collection, {
    get(target, prop, receiver) {
      if (prop in actions) {
        return actions[prop as keyof MutatingMapActions<K, V>];
      }
      if (typeof prop === "symbol") {
        return Reflect.get(target, prop, receiver);
      }
      const targetProperty = target[prop as keyof ReadonlyMap<K, V>];
      if (typeof targetProperty === "function") {
        return targetProperty.bind(target);
      }
      return targetProperty;
    },
  });

  return proxy as ReadonlyMapWithMutatingActions<K, V>;
}

export { useMap };
