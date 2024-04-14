import { act, renderHook } from "@testing-library/react";
import { useSet } from "./useSet";

describe("useSet", () => {
  it("initializes with an empty set if no argument is given", () => {
    const { result } = renderHook(() => useSet<number>());
    expect(result.current.size).toBe(0);
  });

  it("initializes with the specified initial set", () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    expect(result.current.size).toBe(3);
  });

  it("provides the add method", async () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    await act(() => result.current.add(4));
    expect(result.current.size).toBe(4);
  });

  it("supports adding multiple values at once", async () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    await act(() => result.current.add(4, 5, 6));
    expect(result.current.size).toBe(6);
  });

  it("provides the clear method", async () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    await act(() => result.current.clear());
    expect(result.current.size).toBe(0);
  });

  it("provides the delete method", async () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    await act(() => result.current.delete(2));
    expect(result.current.size).toBe(2);
  });

  it("supports deleting multiple values at once", async () => {
    const { result } = renderHook(() => useSet([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    await act(() => result.current.delete(1, 3));
    expect(result.current.size).toBe(7);
    await act(() => result.current.delete(...[5, 7, 9, 1]));
    expect(result.current.size).toBe(4);
  });

  it("iterates over the set", () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    result.current.forEach((element) => {
      expect([1, 2, 3]).toContain(element);
    });
  });

  it("checks if the set contains a value", () => {
    const { result } = renderHook(() => useSet([1, 2, 3]));
    expect(result.current.has(2)).toBe(true);
    expect(result.current.has(4)).toBe(false);
  });
});
