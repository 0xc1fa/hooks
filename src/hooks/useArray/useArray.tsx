import { extendObjectWithProperties } from "../../utils/extendObjectWithProperties";
import { useCallback, useState } from "react";

interface ImmutableArray<T> extends ReadonlyArray<T> {
  clear: () => ImmutableArray<T>;
  copyWithin: (
    target: number,
    start: number,
    end?: number
  ) => ImmutableArray<T>;
  delete: (index: number) => ImmutableArray<T>;
  fill: (value: T, start?: number, end?: number) => ImmutableArray<T>;
  pop: () => ImmutableArray<T>;
  push: (...items: T[]) => ImmutableArray<T>;
  reverse: () => ImmutableArray<T>;
  setArray: (array: T[] | ((prev: T[]) => T[])) => ImmutableArray<T>;
  setItem: (index: number, item: T | ((prev: T) => T)) => ImmutableArray<T>;
  shift: () => ImmutableArray<T>;
  sort: (compareFn?: (a: T, b: T) => number) => ImmutableArray<T>;
  splice: (
    start: number,
    deleteCount?: number,
    ...items: T[]
  ) => ImmutableArray<T>;
  unshift: (...items: T[]) => ImmutableArray<T>;
}

export function useArray<T>(initialArray: T[] = []) {
  const [collection, setCollection] = useState<ReadonlyArray<T>>(initialArray);

  const clear: ImmutableArray<T>["clear"] = useCallback(() => {
    setCollection([]);
    return collection as ImmutableArray<T>;
  }, []);

  const copyWithin: ImmutableArray<T>["copyWithin"] = useCallback(
    (target, start, end?) => {
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
      return collection as ImmutableArray<T>;
    },
    []
  );

  const deleteFn: ImmutableArray<T>["delete"] = useCallback((index) => {
    setCollection((a) => a.filter((_, i) => i !== index));
    return collection as ImmutableArray<T>;
  }, []);

  const fill: ImmutableArray<T>["fill"] = useCallback((value, start?, end?) => {
    start = start === undefined ? 0 : start;
    start = start < 0 ? collection.length + start : start;
    end = end === undefined ? collection.length : end;
    end = end < 0 ? collection.length + end : end;
    setCollection((a) =>
      a.map((item, index) => (index >= start && index < end ? value : item))
    );
    return collection as ImmutableArray<T>;
  }, []);

  const pop: ImmutableArray<T>["pop"] = useCallback(() => {
    setCollection((a) => a.slice(0, -1));
    return collection as ImmutableArray<T>;
  }, []);

  const push: ImmutableArray<T>["push"] = useCallback((...items: T[]) => {
    setCollection((a) => a.concat(...items));
    return collection as ImmutableArray<T>;
  }, []);

  const reverse: ImmutableArray<T>["reverse"] = useCallback(() => {
    setCollection((a) => a.toReversed());
    return collection as ImmutableArray<T>;
  }, []);

  const setItem: ImmutableArray<T>["setItem"] = useCallback((index, item) => {
    if (typeof item === "function") {
      setCollection((a) => a.with(index, (item as Function)(a[index])));
    } else {
      setCollection((a) => a.with(index, item));
    }
    return collection as ImmutableArray<T>;
  }, []);

  const shift: ImmutableArray<T>["shift"] = useCallback(() => {
    setCollection((a) => a.slice(1));
    return collection as ImmutableArray<T>;
  }, []);

  const sort: ImmutableArray<T>["sort"] = useCallback((compareFn?) => {
    setCollection((a) => a.toSorted(compareFn));
    return collection as ImmutableArray<T>;
  }, []);

  const splice: ImmutableArray<T>["splice"] = useCallback(
    (start, deleteCount = 0, ...items) => {
      start = start < 0 ? collection.length + start : start;
      deleteCount = Math.max(0, deleteCount);
      setCollection((a) => a.toSpliced(start, deleteCount, ...items));
      return collection as ImmutableArray<T>;
    },
    []
  );

  const unshift: ImmutableArray<T>["unshift"] = useCallback((...items: T[]) => {
    setCollection((a) => a.toSpliced(0, 0, ...items));
    return collection as ImmutableArray<T>;
  }, []);

  const immutableArray = extendObjectWithProperties(
    collection,
    {
      clear,
      copyWithin,
      delete: deleteFn,
      fill,
      pop,
      push,
      reverse,
      setArray: setCollection as unknown as (
        array: T[] | ((prev: T[]) => T[])
      ) => ImmutableArray<T>,
      setItem,
      shift,
      sort,
      splice,
      unshift,
    },
    { enumerable: false }
  );

  return immutableArray;
}
