export {
  useActivePointerState,
  type PointerActiveInfo,
  type PointerClientPosition,
};

import { useEffect, useState } from "react";
import { useEventListener } from "@/hooks/useEventListener";

type PointerActiveInfo =
  | {
      isPointerDown: false;
      initialPosition: null;
    }
  | {
      isPointerDown: true;
      initialPosition: PointerClientPosition;
    };

type PointerClientPosition = {
  x: number;
  y: number;
};

function useActivePointerState(
  ref: React.RefObject<HTMLElement>
): PointerActiveInfo {
  const [pointerActiveInfo, setPointerActiveInfo] = useState<PointerActiveInfo>(
    {
      isPointerDown: false,
      initialPosition: null,
    }
  );

  useEventListener(ref, "pointerdown", (event) => {
    setPointerActiveInfo({
      isPointerDown: true,
      initialPosition: { x: event.clientX, y: event.clientY },
    });
  });
  useEventListener(document, "pointerup", () => {
    setPointerActiveInfo({
      isPointerDown: false,
      initialPosition: null,
    });
  });
  useEventListener(document, "pointercancel", () => {
    setPointerActiveInfo({
      isPointerDown: false,
      initialPosition: null,
    });
  });

  // reset the value when the component unmounts
  useEffect(() => {
    return () => {
      setPointerActiveInfo({
        isPointerDown: false,
        initialPosition: null,
      });
    };
  }, []);

  return pointerActiveInfo;
}
