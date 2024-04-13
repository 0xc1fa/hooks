import { useEffect } from "react";
import { useEventListener } from "../useEventListener";
import { useBoolean } from "../useBoolean";

function useActivePointerState(ref: React.RefObject<HTMLElement>) {
  const { value, setTrue, setFalse } = useBoolean();

  useEventListener(ref, "pointerdown", setTrue);
  useEventListener(document, "pointerup", setFalse);
  useEventListener(document, "pointercancel", setFalse);

  useEffect(() => {
    return () => setFalse();
  }, []);

  return value;
}

export { useActivePointerState };
