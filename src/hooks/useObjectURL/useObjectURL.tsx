import { useReducer } from "react";

type ObjectWithURL<T extends Blob | MediaSource> = {
  obj: T;
  url: string;
} | null;

function useObjectURL<T extends Blob | MediaSource>(initialObj?: T | null) {
  const getObjectURL = (obj: T) => ({
    obj: obj,
    url: URL.createObjectURL(obj),
  });

  return useReducer(
    (
      state: ObjectWithURL<T> | null,
      obj: T | null
    ): ObjectWithURL<T> | null => {
      if (state?.url) {
        URL.revokeObjectURL(state.url);
      }
      if (!obj) {
        return null;
      }
      return getObjectURL(obj);
    },
    initialObj ? getObjectURL(initialObj) : null
  );
}

export { useObjectURL };
export type { ObjectWithURL };
