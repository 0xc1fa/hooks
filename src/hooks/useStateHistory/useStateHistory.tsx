import { clamp } from "../../utils/math";
import { useLayoutEffect, useRef, useState } from "react";
import { useArray } from "../useArray";

export type StateHistory<T> = {
  getValue: (relativeIndex?: number) => T;
  setValue: (newValue: T) => void;
  navigate: NavigateAction;
};

type NavigateAction = ((magnitude: number) => void) & {
  undo: (times?: number) => void;
  redo: (times?: number) => void;
};

export function useStateHistory<T>(initialValue: T): StateHistory<T> {
  const [value, setValue] = useState<T>(initialValue);
  const history = useArray([initialValue]);
  const [currentindex, setCurrentIndex] = useState(0);
  const shouldUpdateHistory = useRef(false);

  const getValue = (relativeIndex: number = 0) => {
    const targetIndex = clamp(currentindex + relativeIndex, {
      min: 0,
      max: history.length - 1,
    });
    return history[targetIndex];
  };

  const updateCurrentValue = (newValue: T) => {
    setValue(newValue);
    shouldUpdateHistory.current = true;
  };

  const navigate = ((magnitude: number) => {
    const targetIndex = clamp(currentindex + magnitude, {
      min: 0,
      max: history.length - 1,
    });
    shouldUpdateHistory.current = false;
    setValue(history[targetIndex]);
    setCurrentIndex(targetIndex);
  }) as NavigateAction;

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

  useLayoutEffect(() => {
    if (shouldUpdateHistory.current) {
      history.splice(currentindex + 1, Infinity, value);
      setCurrentIndex(currentindex + 1);
    }
  }, [value]);

  const naviagateActions = { undo, redo };
  Object.defineProperties(
    navigate,
    Object.getOwnPropertyNames(naviagateActions).reduce(
      (acc: { [key: string]: {} }, key) => {
        acc[key] = {
          enumerable: false,
          value: naviagateActions[key as keyof typeof naviagateActions],
        };
        return acc;
      },
      {}
    )
  );

  return {
    getValue,
    setValue: updateCurrentValue,
    navigate,
  };
}
