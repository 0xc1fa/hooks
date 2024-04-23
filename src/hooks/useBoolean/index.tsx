export { useBoolean, toggle };

import { useReducer } from "react";

function initializer<T>(args: T): boolean {
  return args == true;
}

function reducer<T>(state: boolean, action: T | typeof toggle): boolean {
  return action === toggle ? !state : initializer(action);
}

function useBoolean<T = boolean>(initialValue: T = false as T) {
  return useReducer(reducer<T>, initialValue, initializer<T>);
}

const toggle = Symbol("toggle");
useBoolean.toggle = toggle;
