export {
  useActivePointerState,
  type PointerActiveInfo,
  type PointerClientPosition,
};

import { useEffect, useState } from "react";
import { useEventListener } from "@/hooks/useEventListener";
import { useBoolean } from "@/hooks/useBoolean";

type PointerActiveInfo = {
  isPointerDown: boolean;
  initialPosition: PointerClientPosition | null;
};

type PointerClientPosition = {
  x: number;
  y: number;
};

function useActivePointerState(
  ref: React.RefObject<HTMLElement>
): PointerActiveInfo {
  const [isPointerDown, setIsPointerDown] = useBoolean();
  const [initialPosition, setInitialPosition] =
    useState<PointerClientPosition | null>(null);

  useEventListener(ref, "pointerdown", (event) => {
    setIsPointerDown(true);
    setInitialPosition({ x: event.clientX, y: event.clientY });
  });
  useEventListener(document, "pointerup", () => {
    setIsPointerDown(false);
    setInitialPosition(null);
  });
  useEventListener(document, "pointercancel", () => {
    setIsPointerDown(false);
    setInitialPosition(null);
  });

  // reset the value when the component unmounts
  useEffect(() => {
    return () => {
      setIsPointerDown(false);
      setInitialPosition(null);
    };
  }, []);

  return { isPointerDown, initialPosition };
}
