export {
  usePointerDragListener,
  type PointerActiveInfo,
  type PointerClientPosition,
};

import { useState } from "react";
import { useEventListener } from "@/hooks/useEventListener";
import { useUnmount } from "../useUnmount";

type PointerActivateState<Buffer> = {
  isPointerDown: true;
  initialPosition: PointerClientPosition;
  buffer: Buffer;
};

type PointerInactiveState = {
  isPointerDown: false;
  initialPosition: null;
  buffer: null;
};

type PointerActiveInfo<Buffer> =
  | PointerActivateState<Buffer>
  | PointerInactiveState;

type PointerClientPosition = {
  x: number;
  y: number;
};

function usePointerDragListener(
  ref: React.RefObject<HTMLElement>,
  callback: (event: PointerEvent, info: PointerActivateState<undefined>) => void
): PointerActiveInfo<undefined>;

function usePointerDragListener<Buffer>(
  ref: React.RefObject<HTMLElement>,
  callback: (event: PointerEvent, info: PointerActivateState<Buffer>) => void,
  bufferCallback: (event: PointerEvent) => Buffer
): PointerActiveInfo<Buffer>;

function usePointerDragListener<Buffer = undefined>(
  ref: React.RefObject<HTMLElement>,
  callback: (event: PointerEvent, info: PointerActivateState<Buffer>) => void,
  bufferCallback?: (event: PointerEvent) => Buffer
): PointerActiveInfo<Buffer> {
  const [pointerActiveInfo, setPointerActiveInfo] = useState<
    PointerActiveInfo<Buffer>
  >(createInactiveInfo());

  useEventListener(ref, "pointerdown", (event) => {
    ref.current?.setPointerCapture(event.pointerId);
    const bufferValue = bufferCallback
      ? bufferCallback(event)
      : (undefined as Buffer);
    setPointerActiveInfo(
      createActiveInfo<Buffer>(
        { x: event.clientX, y: event.clientY },
        bufferValue
      )
    );
  });

  useEventListener(ref, "pointermove", (event) => {
    if (pointerActiveInfo.isPointerDown) {
      callback(event, pointerActiveInfo);
    }
  });

  useEventListener(document, ["pointercancel", "pointerup"], () => {
    setPointerActiveInfo(createInactiveInfo());
  });

  useUnmount(() => setPointerActiveInfo(createInactiveInfo()));

  return pointerActiveInfo;
}

function createActiveInfo<Buffer>(
  initialPosition: PointerClientPosition,
  bufferValue: Buffer
): PointerActivateState<Buffer> {
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
