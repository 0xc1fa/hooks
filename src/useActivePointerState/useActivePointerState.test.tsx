import { fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { useActivePointerState } from "./useActivePointerState";

describe("useActivePointerState", () => {
  test("initializes as inactive", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useActivePointerState(ref));
    expect(result.current).toBe(false);
  });

  test("activates on pointerdown", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useActivePointerState(ref));

    act(() => fireEvent.pointerDown(ref.current));

    expect(result.current).toBe(true);
  });

  test("deactivates on pointerup", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useActivePointerState(ref));

    act(() => fireEvent.pointerDown(ref.current));
    act(() => fireEvent.pointerUp(document));

    expect(result.current).toBe(false);
  });

  test("deactivates on pointercancel", () => {
    const ref = { current: document.createElement("div") };
    const { result } = renderHook(() => useActivePointerState(ref));

    act(() => fireEvent.pointerDown(ref.current));
    act(() => fireEvent.pointerCancel(document));

    expect(result.current).toBe(false);
  });

  test("deactivates upon unmounting", () => {
    const ref = { current: document.createElement("div") };
    const { result, unmount } = renderHook(() => useActivePointerState(ref));

    act(() => fireEvent.pointerDown(ref.current));
    unmount();
    waitFor(() => !result.current).then(() => {
      expect(result.current).toBe(false);
    });
  });
});
