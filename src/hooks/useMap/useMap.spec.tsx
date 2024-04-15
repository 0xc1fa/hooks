import { act, renderHook } from "@testing-library/react";
import { useMap } from "./useMap";

describe("useMap", () => {
  it("initializes with an empty set if no argument is given", () => {
    const { result } = renderHook(() => useMap<string, number>());
    expect(result.current.size).toBe(0);
  });

  it("initializes with the specified initial set", () => {
    const { result } = renderHook(() =>
      useMap([
        ["foo", 1],
        ["bar", 2],
        ["baz", 3],
      ])
    );
    expect(result.current.size).toBe(3);
  });

  it("provides the add method", () => {
    const { result } = renderHook(() =>
      useMap([
        ["foo", 1],
        ["bar", 2],
        ["baz", 3],
      ])
    );
    act(() => result.current.set("qux", 4));
    expect(result.current.size).toBe(4);
  });

  it("provides the clear method", () => {
    const { result } = renderHook(() =>
      useMap([
        ["foo", 1],
        ["bar", 2],
        ["baz", 3],
      ])
    );
    act(() => result.current.clear());
    expect(result.current.size).toBe(0);
  });

  it("provides the delete method", () => {
    const { result } = renderHook(() =>
      useMap([
        ["foo", 1],
        ["bar", 2],
        ["baz", 3],
      ])
    );
    act(() => result.current.delete("bar"));
    expect(result.current.size).toBe(2);
  });

  it("supports deleting multiple values at once", () => {
    const { result } = renderHook(() =>
      useMap([
        ["foo", 1],
        ["bar", 2],
        ["baz", 3],
      ])
    );
    act(() => result.current.delete("foo", "bar"));
    expect(result.current.size).toBe(1);
  });

  it("iterates over the map", () => {
    const { result } = renderHook(() =>
      useMap([
        ["foo", 1],
        ["bar", 2],
        ["baz", 3],
      ])
    );
    result.current.forEach((element, key) => {
      expect(["foo", "bar", "baz"]).toContain(key);
      expect([1, 2, 3]).toContain(element);
    });
  });

  it("checks if the set contains a value", () => {
    const { result } = renderHook(() =>
      useMap([
        ["foo", 1],
        ["bar", 2],
        ["baz", 3],
      ])
    );
    expect(result.current.has("foo")).toBe(true);
    expect(result.current.has("qux")).toBe(false);
  });
});
