import { renderHook, act } from "@testing-library/react";
import { useBoolean } from ".";

describe("useBoolean", () => {
  test("initializes with default false value when no initial value is provided", () => {
    const { result } = renderHook(() => useBoolean());
    expect(result.current[0]).toBe(false);
  });

  test("initializes with provided initial true value", () => {
    const { result } = renderHook(() => useBoolean(true));
    expect(result.current[0]).toBe(true);
  });

  test("initializes with provided empty array", () => {
    const { result } = renderHook(() => useBoolean([]));
    expect(result.current[0]).toBe(false);
  });

  test("initializes with provided empty string", () => {
    const { result } = renderHook(() => useBoolean(""));
    expect(result.current[0]).toBe(false);
  });

  test("initializes with provided empty object", () => {
    const { result } = renderHook(() => useBoolean({}));
    expect(result.current[0]).toBe(false);
  });

  test("initializes with provided no-empty array", () => {
    const { result } = renderHook(() => useBoolean([1]));
    expect(result.current[0]).toBe(true);
  });

  test('sets its value to true when "setTrue" is called', () => {
    const { result } = renderHook(() => useBoolean());
    act(() => result.current[1](true));
    expect(result.current[0]).toBe(true);
  });

  test('sets its value to false when "setFalse" is called', () => {
    const { result } = renderHook(() => useBoolean(true));
    act(() => result.current[1](false));
    expect(result.current[0]).toBe(false);
  });

  test('toggles the itst value between true and false when "toggle" is called', () => {
    const { result } = renderHook(() => useBoolean());
    act(() => result.current[1](useBoolean.toggle));
    expect(result.current[0]).toBe(true);
    act(() => result.current[1](useBoolean.toggle));
    expect(result.current[0]).toBe(false);
  });
});
