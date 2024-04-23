import { renderHook } from "@testing-library/react";
import { useSmoothTimeUpdate } from ".";

function createMockAudioElement(paused: boolean): HTMLAudioElement {
  return {
    paused: paused,
    dispatchEvent: jest.fn(),
  } as unknown as HTMLAudioElement;
}

describe("useSmoothTimeUpdate", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("dispatches 'timeupdate' when audio is playing", () => {
    const mockAudioElement = { current: createMockAudioElement(false) };
    const { unmount } = renderHook(() => useSmoothTimeUpdate(mockAudioElement));

    expect(mockAudioElement.current).toBeTruthy();
    jest.advanceTimersByTime(8);
    expect(mockAudioElement.current!.dispatchEvent).not.toHaveBeenCalled();
    jest.advanceTimersByTime(8);
    expect(mockAudioElement.current!.dispatchEvent).toHaveBeenCalledWith(
      new Event("timeupdate")
    );
    unmount();
  });

  it("does not dispatch 'timeupdate' when audio is paused", () => {
    const mockAudioElement = { current: createMockAudioElement(true) };
    const { unmount } = renderHook(() => useSmoothTimeUpdate(mockAudioElement));
    jest.advanceTimersByTime(1000);

    expect(mockAudioElement.current).toBeTruthy();
    expect(mockAudioElement.current!.dispatchEvent).not.toHaveBeenCalled();
    unmount();
  });

  it("dispatches 'timeupdate' after the ref is not null", () => {
    const mockAudioElement = {
      current: null,
    } as React.MutableRefObject<HTMLAudioElement | null>;
    const { unmount } = renderHook(() => useSmoothTimeUpdate(mockAudioElement));

    expect(mockAudioElement.current).toBeNull();
    jest.advanceTimersByTime(50);
    mockAudioElement.current = {
      paused: false,
      dispatchEvent: jest.fn(),
    } as unknown as HTMLAudioElement;
    expect(mockAudioElement.current).toBeTruthy();
    jest.advanceTimersByTime(16);
    expect(mockAudioElement.current!.dispatchEvent).toHaveBeenCalledWith(
      new Event("timeupdate")
    );
    unmount();
  });
});
