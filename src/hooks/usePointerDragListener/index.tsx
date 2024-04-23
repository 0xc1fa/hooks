export {
  usePointerDragListener,
  type PointerActiveInfo,
  type PointerClientPosition,
};

import { useEffect, useState } from "react";
import { useEventListener } from "@/hooks/useEventListener";

type PointerActivateState<T> = {
  isPointerDown: true;
  initialPosition: PointerClientPosition;
  buffer: T;
};

type PointerInactiveState = {
  isPointerDown: false;
  initialPosition: null;
  buffer: null;
};

type PointerActiveInfo<T> = PointerActivateState<T> | PointerInactiveState;

type PointerClientPosition = {
  x: number;
  y: number;
};

function usePointerDragListener(
  ref: React.RefObject<HTMLElement>,
  callback: (event: PointerEvent, info: PointerActivateState<undefined>) => void
): PointerActiveInfo<undefined>;

function usePointerDragListener<T>(
  ref: React.RefObject<HTMLElement>,
  callback: (event: PointerEvent, info: PointerActivateState<T>) => void,
  bufferCallback: (event: PointerEvent) => T
): PointerActiveInfo<T>;

function usePointerDragListener<T = undefined>(
  ref: React.RefObject<HTMLElement>,
  callback: (event: PointerEvent, info: PointerActivateState<T>) => void,
  bufferCallback?: (event: PointerEvent) => T
): PointerActiveInfo<T> {
  const [pointerActiveInfo, setPointerActiveInfo] = useState<
    PointerActiveInfo<T>
  >(createInactiveInfo());

  useEventListener(ref, "pointerdown", (event) => {
    ref.current?.setPointerCapture(event.pointerId);
    const bufferValue = bufferCallback
      ? bufferCallback(event)
      : (undefined as T);
    setPointerActiveInfo(
      createActiveInfo<T>({ x: event.clientX, y: event.clientY }, bufferValue)
    );
  });

  useEventListener(ref, "pointermove", (event) => {
    if (pointerActiveInfo.isPointerDown) {
      callback(event, pointerActiveInfo);
    }
  });

  useEventListener(document, "pointerup", () => {
    setPointerActiveInfo(createInactiveInfo());
  });

  useEventListener(document, "pointercancel", () => {
    setPointerActiveInfo(createInactiveInfo());
  });

  // reset the value when the component unmounts
  useEffect(() => {
    return () => {
      setPointerActiveInfo(createInactiveInfo());
    };
  }, []);

  return pointerActiveInfo;
}

function createActiveInfo<T>(
  initialPosition: PointerClientPosition,
  bufferValue: T
): PointerActivateState<T> {
  return {
    isPointerDown: true,
    initialPosition: initialPosition,
    buffer: bufferValue,
  };
}

function createInactiveInfo(): PointerInactiveState {
  return {
    isPointerDown: false,
    initialPosition: null,
    buffer: null,
  };
}
