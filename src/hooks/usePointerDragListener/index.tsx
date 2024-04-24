export { usePointerDragListener, type PointerDragListenerOptions };

import { useRef } from "react";
import { useEventListener } from "@/hooks/useEventListener";
import { useUnmount } from "@/hooks/useUnmount";

type PointerDragListenerOptions = {
  capturePointer?: boolean;
  lockPointer?: boolean;
};

function usePointerDragListener(
  ref: React.RefObject<HTMLElement>,
  callback: (event: PointerEvent) => void,
  options?: PointerDragListenerOptions
): void {
  const isPointerDown = useRef(false);

  useEventListener(ref, "pointerdown", setup);

  useEventListener(ref, "pointermove", (event) => {
    if (isPointerDown.current) callback(event);
  });

  useEventListener(document, ["pointercancel", "pointerup"], clearup);

  useUnmount(clearup);

  function setup(event: PointerEvent) {
    isPointerDown.current = true;
    if (options?.lockPointer) ref.current?.requestPointerLock();
    if (options?.capturePointer)
      ref.current?.setPointerCapture(event.pointerId);
  }

  function clearup() {
    options?.lockPointer && document.exitPointerLock();
    isPointerDown.current = false;
  }
}
