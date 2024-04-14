import { useState } from "react";


type ArrayActions<T> = {
  clear: () => ReadonlyArrayWithAction<T>;
  copyWithin: (target: number, start: number, end?: number) => ReadonlyArrayWithAction<T>;
  delete: (index: number) => ReadonlyArray<T>;
  fill: (value: T, start?: number, end?: number) => ReadonlyArrayWithAction<T>;
  pop: () => ReadonlyArrayWithAction<T>;
  push: (...items: T[]) => ReadonlyArrayWithAction<T>;
  reverse: () => ReadonlyArrayWithAction<T>;
  setArray: (array: T[] | ((prev: T[]) => T[])) => ReadonlyArrayWithAction<T>;
  setItem: (index: number, item: T | ((prev: T) => T)) => ReadonlyArrayWithAction<T>;
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
  const [array, setArray] = useState<ReadonlyArray<T>>(initialArray);

  const actions: ArrayActions<T> = {
    clear: () => {
      setArray([]);
      return array as ReadonlyArrayWithAction<T>;
    },
    copyWithin: (target: number, start: number, end?: number) => {
      setArray((currentArray) => {
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
      return array as ReadonlyArrayWithAction<T>;
    },
    delete: (index: number) => {
      setArray((a) => a.filter((_, i) => i !== index));
      return array as ReadonlyArrayWithAction<T>;
    },
    fill: (value: T, start?: number, end?: number) => {
      start = start === undefined ? 0 : start;
      start = start < 0 ? array.length + start : start;
      end = end === undefined ? array.length : end;
      end = end < 0 ? array.length + end : end;
      setArray((a) =>
        a.map((item, index) => (index >= start && index < end ? value : item))
      );
      return array as ReadonlyArrayWithAction<T>;
    },
    pop: () => {
      setArray((a) => a.slice(0, -1));
      return array as ReadonlyArrayWithAction<T>;
    },
    push: (...items: T[]) => {
      setArray((a) => a.concat(...items));
      return array as ReadonlyArrayWithAction<T>;
    },
    reverse: () => {
      setArray((a) => a.toReversed());
      return array as ReadonlyArrayWithAction<T>;
    },
    setArray: (newArray: T[] | ((prev: T[]) => T[])) => {
      setArray((a) =>
        typeof newArray === "function" ? (newArray as Function)(a) : newArray
      );
      return array as ReadonlyArrayWithAction<T>;
    },
    setItem: (index: number, item: T | ((prev: T) => T)) => {
      if (typeof item === "function") {
        setArray((a) => a.with(index, (item as Function)(a[index])));
      } else {
        setArray((a) => a.with(index, item));
      }
      return array as ReadonlyArrayWithAction<T>;
    },
    shift: () => {
      setArray((a) => a.slice(1));
      return array as ReadonlyArrayWithAction<T>;
    },
    sort: (compareFn?: (a: T, b: T) => number) => {
      setArray((a) => a.toSorted(compareFn));
      return array as ReadonlyArrayWithAction<T>;
    },
    splice: (start: number, deleteCount: number = 0, ...items: T[]) => {
      start = start < 0 ? array.length + start : start;
      deleteCount = Math.max(0, deleteCount);
      setArray((a) => a.toSpliced(start, deleteCount, ...items));
      return array as ReadonlyArrayWithAction<T>;
    },
    unshift: (...items: T[]) => {
      setArray((a) => a.toSpliced(0, 0, ...items));
      return array as ReadonlyArrayWithAction<T>;
    },
  };

  Object.defineProperties(
    array,
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

  return array as ReadonlyArrayWithAction<T>;
}
