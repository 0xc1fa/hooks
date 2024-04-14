import { act, renderHook } from "@testing-library/react";
import { useArray } from "./useArray";

describe("useArray", () => {
  it("initialize with the specified initial array", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    expect(result.current).toEqual([1, 2, 3]);
  });

  it("provides the clear method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.clear());
    expect(result.current).toEqual([]);
  });

  it("mimic the copyWithin method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.copyWithin(0, 1));
    expect(result.current).toEqual([2, 3, 3]);
  });

  it("provide the delete method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.delete(1));
    expect(result.current).toEqual([1, 3]);
  });

  it("mimic the fill method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.fill(4));
    expect(result.current).toEqual([4, 4, 4]);
  });

  it("mimic the pop method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.pop());
    expect(result.current).toEqual([1, 2]);
  });

  it("mimic the push method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.push(4, 5));
    expect(result.current).toEqual([1, 2, 3, 4, 5]);
  });

  it("mimic the reverse method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.reverse());
    expect(result.current).toEqual([3, 2, 1]);
  });

  it("mimics the whole array setter", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.setArray([4, 5, 6]));
    expect(result.current).toEqual([4, 5, 6]);
  });

  it("mimics the whole array setter with callback", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.setArray((prev) => prev.map((n) => n + 3)));
    expect(result.current).toEqual([4, 5, 6]);
  });

  it("provides the array item setter", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.setItem(1, 4));
    expect(result.current).toEqual([1, 4, 3]);
  });

  it("provides the array item setter with callback", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.setItem(2, (prev) => prev * 2));
    expect(result.current).toEqual([1, 2, 6]);
  });

  it("mimic the shift method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.shift());
    expect(result.current).toEqual([2, 3]);
  });

  it("mimic the sort method", () => {
    const { result } = renderHook(() => useArray([3, 2, 1]));
    act(() => result.current.sort());
    expect(result.current).toEqual([1, 2, 3]);
  });

  it("mimic the splice method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.splice(1, 1, 4, 5));
    expect(result.current).toEqual([1, 4, 5, 3]);
  });

  it("mimic the unshift method", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => result.current.unshift(4, 5));
    expect(result.current).toEqual([4, 5, 1, 2, 3]);
  });

  it("mimic multiple array methods", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => {
      expect(result.current.push(4, 5)).toBe(result.current);
      expect(result.current.reverse()).toBe(result.current);
      expect(result.current.splice(1, 1, 6, 7)).toBe(result.current);
      expect(result.current.pop()).toBe(result.current);
      expect(result.current.shift()).toBe(result.current);
      expect(result.current.setItem(1, 10)).toBe(result.current);
      expect(result.current.unshift(6)).toBe(result.current);
    });
    expect(result.current).toEqual([6, 6, 10, 3, 2]);
  });

  it("supports methods chaining", () => {
    const { result } = renderHook(() => useArray([1, 2, 3]));
    act(() => {
      const final = result.current
        .push(4, 5)
        .reverse()
        .splice(1, 1, 6, 7)
        .pop()
        .shift()
        .setItem(1, 10)
        .unshift(6);
      expect(final).toBe(result.current);
    });
    expect(result.current).toEqual([6, 6, 10, 3, 2]);
  });

  it("iterate properly", () => {
    const { result } = renderHook(() => useArray([0, 1, 2, 3]));
    result.current.forEach((item, index) => {
      expect(item).toEqual(index);
    });
  });
});
