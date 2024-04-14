import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ArrayActions<T> = {
  clear: () => ReadonlyArrayWithAction<T>;
  copyWithin: (
    target: number,
    start: number,
    end?: number
  ) => ReadonlyArrayWithAction<T>;
  delete: (index: number) => ReadonlyArray<T>;
  fill: (value: T, start?: number, end?: number) => ReadonlyArrayWithAction<T>;
  pop: () => ReadonlyArrayWithAction<T>;
  push: (...items: T[]) => ReadonlyArrayWithAction<T>;
  reverse: () => ReadonlyArrayWithAction<T>;
  setArray: (array: T[] | ((prev: T[]) => T[])) => ReadonlyArrayWithAction<T>;
  setItem: (
    index: number,
    item: T | ((prev: T) => T)
  ) => ReadonlyArrayWithAction<T>;
  shift: () => ReadonlyArrayWithAction<T>;
  sort: (compareFn?: (a: T, b: T) => number) => ReadonlyArrayWithAction<T>;
  splice: (
    start: number,
    deleteCount?: number,
    ...items: T[]
  ) => ReadonlyArrayWithAction<T>;
  unshift: (...items: T[]) => ReadonlyArrayWithAction<T>;
};

type ReadonlyArrayWithAction<T> = ReadonlyArray<T> & ArrayActions<T>;

export function useArray<T>(initialArray: T[] = []) {
  const [collection, setCollection] = useState<ReadonlyArray<T>>(initialArray);
  const firstRender = useRef(true);

  const clear = useCallback(() => {
    setCollection([]);
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const copyWithin = useCallback(
    (target: number, start: number, end?: number) => {
      setCollection((currentArray) => {
        target = target < 0 ? currentArray.length + target : target;
        start = start < 0 ? currentArray.length + start : start;
        end =
          end === undefined
            ? currentArray.length
            : end < 0
            ? currentArray.length + end
            : end;

        target = Math.max(0, Math.min(currentArray.length, target));
        start = Math.max(0, Math.min(currentArray.length, start));
        end = Math.max(start, Math.min(currentArray.length, end));

        const copyPart = currentArray.slice(start, end);
        const newArray = [...currentArray];

        for (
          let i = 0;
          i < copyPart.length && target + i < newArray.length;
          i++
        ) {
          newArray[target + i] = copyPart[i];
        }

        return newArray;
      });
      return collection as ReadonlyArrayWithAction<T>;
    },
    []
  );

  const deleteFn = useCallback((index: number) => {
    setCollection((a) => a.filter((_, i) => i !== index));
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const fill = useCallback((value: T, start?: number, end?: number) => {
    start = start === undefined ? 0 : start;
    start = start < 0 ? collection.length + start : start;
    end = end === undefined ? collection.length : end;
    end = end < 0 ? collection.length + end : end;
    setCollection((a) =>
      a.map((item, index) => (index >= start && index < end ? value : item))
    );
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const pop = useCallback(() => {
    setCollection((a) => a.slice(0, -1));
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const push = useCallback((...items: T[]) => {
    setCollection((a) => a.concat(...items));
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const reverse = useCallback(() => {
    setCollection((a) => a.toReversed());
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const setItem = useCallback((index: number, item: T | ((prev: T) => T)) => {
    if (typeof item === "function") {
      setCollection((a) => a.with(index, (item as Function)(a[index])));
    } else {
      setCollection((a) => a.with(index, item));
    }
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const shift = useCallback(() => {
    setCollection((a) => a.slice(1));
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const sort = useCallback((compareFn?: (a: T, b: T) => number) => {
    setCollection((a) => a.toSorted(compareFn));
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const splice = useCallback(
    (start: number, deleteCount: number = 0, ...items: T[]) => {
      start = start < 0 ? collection.length + start : start;
      deleteCount = Math.max(0, deleteCount);
      setCollection((a) => a.toSpliced(start, deleteCount, ...items));
      return collection as ReadonlyArrayWithAction<T>;
    },
    []
  );

  const unshift = useCallback((...items: T[]) => {
    setCollection((a) => a.toSpliced(0, 0, ...items));
    return collection as ReadonlyArrayWithAction<T>;
  }, []);

  const actions: ArrayActions<T> = {
    clear,
    copyWithin,
    delete: deleteFn,
    fill,
    pop,
    push,
    reverse,
    setArray: setCollection as unknown as (
      array: T[] | ((prev: T[]) => T[])
    ) => ReadonlyArrayWithAction<T>,
    setItem,
    shift,
    sort,
    splice,
    unshift,
  };

  Object.defineProperties(
    collection,
    Object.getOwnPropertyNames(actions).reduce(
      (acc: { [key: string]: {} }, key) => {
        acc[key] = {
          enumerable: false,
          value: actions[key as keyof ArrayActions<T>],
        };
        return acc;
      },
      {}
    )
  );

  return collection as ReadonlyArrayWithAction<T>;
}
