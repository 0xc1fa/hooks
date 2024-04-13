import { clamp } from "../../utils/math";
import { useLayoutEffect, useRef, useState } from "react";

export type StateHistory<T> = {
  getValue: (relativeIndex?: number) => T;
  setValue: (newValue: T) => void;
  navigate: (magnitude: number) => void;
  undo: (times?: number) => void;
  redo: (times?: number) => void;
};

export function useStateHistory<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const history = useRef([initialValue]);
  const currentindex = useRef(0);
  const nextIndex = useRef(0);
  const shouldUpdateHistory = useRef(false);

  const getValue = (relativeIndex: number = 0) => {
    const targetIndex = clamp(currentindex.current + relativeIndex, {
      min: 0,
      max: history.current.length - 1,
    });
    return history.current[targetIndex];
  };

  const undo = (times: number = 1) => {
    if (times < 0) {
      throw new Error("Undo times must be a positive number");
    }
    navigate(-times);
  };

  const redo = (times: number = 1) => {
    if (times < 0) {
      throw new Error("Redo times must be a positive number");
    }
    navigate(times);
  };

  const updateCurrentValue = (newValue: T) => {
    setValue(newValue);
    nextIndex.current = currentindex.current + 1;
    if (newValue !== value) {
      shouldUpdateHistory.current = true;
    } else {
      shouldUpdateHistory.current = false;
    }
  };

  const navigate = (magnitude: number) => {
    if (magnitude === 0) {
      return;
    }
    const targetIndex = clamp(currentindex.current + magnitude, {
      min: 0,
      max: history.current.length - 1,
    });
    setValue(history.current[targetIndex]);
    nextIndex.current = targetIndex;
    shouldUpdateHistory.current = false;
  };

  useLayoutEffect(() => {
    currentindex.current = nextIndex.current;
    if (shouldUpdateHistory.current) {
      history.current.splice(nextIndex.current, Infinity);
      history.current.push(value);
      currentindex.current = history.current.length - 1;
    }
  }, [value]);

  return {
    getValue,
    setValue: updateCurrentValue,
    navigate,
    undo,
    redo,
  };
}
