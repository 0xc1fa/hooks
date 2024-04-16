import { useEffect } from "react";
import { useEventListener } from "../useEventListener";
import { useBoolean } from "../useBoolean";

function useActivePointerState(ref: React.RefObject<HTMLElement>) {
  const [value, setValue] = useBoolean();

  useEventListener(ref, "pointerdown", () => setValue(true));
  useEventListener(document, "pointerup", () => setValue(false));
  useEventListener(document, "pointercancel", () => setValue(false));

  useEffect(() => () => setValue(false), []);

  return value;
}

export { useActivePointerState };
