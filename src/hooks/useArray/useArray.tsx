import { useState } from "react";

type ArrayActions<T> = {
  clear: () => ArrayActions<T>;
  copyWithin: (target: number, start: number, end?: number) => ArrayActions<T>;
  delete: (index: number) => ArrayActions<T>;
  fill: (value: T, start?: number, end?: number) => ArrayActions<T>;
  pop: () => ArrayActions<T>;
  push: (...items: T[]) => ArrayActions<T>;
  reverse: () => ArrayActions<T>;
  setArray: (array: T[] | ((prev: T[]) => T[])) => ArrayActions<T>;
  setItem: (index: number, item: T | ((prev: T) => T)) => ArrayActions<T>;
  shift: () => ArrayActions<T>;
  sort: (compareFn?: (a: T, b: T) => number) => ArrayActions<T>;
  splice: (
    start: number,
    deleteCount?: number,
    ...items: T[]
  ) => ArrayActions<T>;
  unshift: (...items: T[]) => ArrayActions<T>;
};

export function useArray<T>(initialArray: T[] = []) {
  const [array, setArray] = useState<ReadonlyArray<T>>(initialArray);

  const actions: ArrayActions<T> = {
    clear: () => {
      setArray([]);
      return actions;
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
      return actions;
    },
    delete: (index: number) => {
      setArray((a) => a.filter((_, i) => i !== index));
      return actions;
    },
    fill: (value: T, start?: number, end?: number) => {
      start = start === undefined ? 0 : start;
      start = start < 0 ? array.length + start : start;
      end = end === undefined ? array.length : end;
      end = end < 0 ? array.length + end : end;
      setArray((a) =>
        a.map((item, index) => (index >= start && index < end ? value : item))
      );
      return actions;
    },
    pop: () => {
      setArray((a) => a.slice(0, -1));
      return actions;
    },
    push: (...items: T[]) => {
      setArray((a) => a.concat(...items));
      return actions;
    },
    reverse: () => {
      setArray((a) => a.toReversed());
      return actions;
    },
    setArray: (newArray: T[] | ((prev: T[]) => T[])) => {
      setArray((a) =>
        typeof newArray === "function" ? (newArray as Function)(a) : newArray
      );
      return actions;
    },
    setItem: (index: number, item: T | ((prev: T) => T)) => {
      if (typeof item === "function") {
        setArray((a) => a.with(index, (item as Function)(a[index])));
      } else {
        setArray((a) => a.with(index, item));
      }
      return actions;
    },
    shift: () => {
      setArray((a) => a.slice(1));
      return actions;
    },
    sort: (compareFn?: (a: T, b: T) => number) => {
      setArray((a) => a.toSorted(compareFn));
      return actions;
    },
    splice: (start: number, deleteCount: number = 0, ...items: T[]) => {
      start = start < 0 ? array.length + start : start;
      deleteCount = Math.max(0, deleteCount);
      setArray((a) => a.toSpliced(start, deleteCount, ...items));
      return actions;
    },
    unshift: (...items: T[]) => {
      setArray((a) => a.toSpliced(0, 0, ...items));
      return actions;
    },
  };

  return [array as ReadonlyArray<T>, actions] as const;
}
