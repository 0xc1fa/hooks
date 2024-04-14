import { useState } from "react";

type MutatingSetActions<T> = {
  add: (...value: T[]) => ReadonlySetWithMutatingActions<T>;
  clear: () => ReadonlySetWithMutatingActions<T>;
  delete: (...value: T[]) => ReadonlySetWithMutatingActions<T>;
};

type ReadonlySetWithMutatingActions<T> = ReadonlySet<T> & MutatingSetActions<T>;

function useSet<T>(initialItems: T[] = []): ReadonlySetWithMutatingActions<T> {
  const [collection, setCollection] = useState<ReadonlySet<T>>(
    new Set<T>(initialItems)
  );

  const actions: MutatingSetActions<T> = {
    add: (...value: T[]) => {
      setCollection((prev) => new Set([...Array.from(prev), ...value]));
      return proxy as ReadonlySetWithMutatingActions<T>;
    },
    clear: () => {
      setCollection(new Set());
      return proxy as ReadonlySetWithMutatingActions<T>;
    },
    delete: (...value: T[]) => {
      setCollection(
        (prev) => new Set(Array.from(prev).filter((v) => !value.includes(v)))
      );
      return proxy as ReadonlySetWithMutatingActions<T>;
    },
  };

  Object.defineProperties(
    collection,
    Object.getOwnPropertyNames(actions).reduce(
      (acc: { [key: string]: {} }, key) => {
        acc[key] = {
          enumerable: false,
          value: actions[key as keyof MutatingSetActions<T>],
        };
        return acc;
      },
      {}
    )
  );

  const proxy = new Proxy(collection, {
    get(target, prop, receiver) {
      if (prop in actions) {
        return actions[prop as keyof MutatingSetActions<T>];
      }
      if (typeof prop === "symbol") {
        return Reflect.get(target, prop, receiver);
      }
      const targetProperty = target[prop as keyof ReadonlySet<T>];
      if (typeof targetProperty === "function") {
        return targetProperty.bind(target);
      }
      return targetProperty;
    },
  });

  return proxy as ReadonlySetWithMutatingActions<T>;
}

export { useSet };
