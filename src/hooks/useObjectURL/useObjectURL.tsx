import { useReducer } from "react";

type ObjectWithURL<T extends Blob | MediaSource> = {
  obj: T;
  url: string;
} | null;

function createObjectWithURL<T extends Blob | MediaSource>(
  obj: T
): ObjectWithURL<T> {
  return { obj, url: URL.createObjectURL(obj) };
}

function getObjectURLString<T extends Blob | MediaSource>(
  obj: T | null
): ObjectWithURL<T> | null {
  return obj ? createObjectWithURL(obj) : null;
}

function objectURLReducer<T extends Blob | MediaSource>(
  state: ObjectWithURL<T> | null,
  obj: T | null
): ObjectWithURL<T> | null {
  if (state?.url) {
    URL.revokeObjectURL(state.url);
  }
  return getObjectURLString(obj);
}

function useObjectURL<T extends Blob | MediaSource>(initialObj: T | null) {
  return useReducer(objectURLReducer, initialObj, getObjectURLString);
}

export { useObjectURL };
export type { ObjectWithURL };
