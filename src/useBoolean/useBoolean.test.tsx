import { renderHook, act } from "@testing-library/react";
import { useBoolean } from "./useBoolean";

describe("useBoolean", () => {
  test("initializes with default false value when no initial value is provided", () => {
    const { result } = renderHook(() => useBoolean());
    expect(result.current.value).toBe(false);
  });

  test("initializes with provided initial true value", () => {
    const { result } = renderHook(() => useBoolean(true));
    expect(result.current.value).toBe(true);
  });

  test('sets its value to true when "setTrue" is called', () => {
    const { result } = renderHook(() => useBoolean());
    act(() => {
      result.current.setTrue();
    });
    expect(result.current.value).toBe(true);
  });

  test('sets its value to false when "setFalse" is called', () => {
    const { result } = renderHook(() => useBoolean(true));
    act(() => {
      result.current.setFalse();
    });
    expect(result.current.value).toBe(false);
  });

  test('toggles the itst value between true and false when "toggle" is called', () => {
    const { result } = renderHook(() => useBoolean());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(false);
  });
});
