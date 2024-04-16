import { useEffect, useReducer } from "react";

function appendToHistory<T>(
  state: T[],
  action: { value: T; maxLength: number }
): T[] {
  return [action.value, ...state].slice(0, action.maxLength);
}

function useTrace<T>(value: T, maxLength: number = Infinity): T[] {
  const [trace, addItem] = useReducer(appendToHistory<T>, new Array<T>());
  useEffect(() => addItem({ value, maxLength }), [value, maxLength]);
  return trace;
}

export { useTrace };
