import { fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { useActivePointerState } from "./useActivePointerState";

describe("useActivePointerState", () => {
  let ref: { current: HTMLDivElement };
  let result: { current: boolean };
  let unmount: () => void;

  beforeEach(() => {
    ref = { current: document.createElement("div") };
    const renderHookReturn = renderHook(() => useActivePointerState(ref));
    result = renderHookReturn.result;
    unmount = renderHookReturn.unmount;
  });

  test("initializes as inactive", () => {
    expect(result.current).toBe(false);
  });

  test("activates on pointerdown", () => {
    act(() => fireEvent.pointerDown(ref.current));

    expect(result.current).toBe(true);
  });

  test("deactivates on pointerup", () => {
    act(() => fireEvent.pointerDown(ref.current));
    act(() => fireEvent.pointerUp(document));

    expect(result.current).toBe(false);
  });

  test("deactivates on pointercancel", () => {
    act(() => fireEvent.pointerDown(ref.current));
    act(() => fireEvent.pointerCancel(document));

    expect(result.current).toBe(false);
  });

  test("deactivates upon unmounting", () => {
    act(() => fireEvent.pointerDown(ref.current));
    unmount();

    waitFor(() => !result.current).then(() => {
      expect(result.current).toBe(false);
    });
  });
});
