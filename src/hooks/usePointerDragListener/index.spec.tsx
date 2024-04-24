import { fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { usePointerDragListener } from ".";

describe("useActivePointerState", () => {
  let ref: { current: HTMLDivElement };
  let callback: jest.Mock;
  let unmount: () => void;

  beforeEach(() => {
    ref = { current: document.createElement("div") };
    callback = jest.fn();
    ({ unmount } = renderHook(() => usePointerDragListener(ref, callback)));
  });

  test("initializes as inactive", () => {
    expect(callback).not.toHaveBeenCalled();
  });

  test("activates on pointerdown", () => {
    act(() => fireEvent.pointerDown(ref.current));
    expect(callback).not.toHaveBeenCalled();
  });

  test("calls callback on pointermove", () => {
    act(() => fireEvent.pointerDown(ref.current));
    act(() => fireEvent.pointerMove(ref.current));
    expect(callback).toHaveBeenCalled();
  });

  test("deactivates on pointerup", () => {
    act(() => fireEvent.pointerDown(ref.current));
    act(() => fireEvent.pointerUp(document));
    act(() => fireEvent.pointerMove(document));
    expect(callback).not.toHaveBeenCalled();
  });

  test("deactivates on pointercancel", () => {
    act(() => fireEvent.pointerDown(ref.current));
    act(() => fireEvent.pointerCancel(document));
    act(() => fireEvent.pointerMove(document));
    expect(callback).not.toHaveBeenCalled();
  });

  test("deactivates upon unmounting", () => {
    act(() => fireEvent.pointerDown(ref.current));
    unmount();
    expect(callback).not.toHaveBeenCalled();
  });
});
