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

  it("handle consecutive setter calls correctly", () => {
    const { result } = renderHook(() => useMap<string, number>());
    act(() => {
      result.current.set("foo", 1);
      result.current.set("foo", 2);
      result.current.set("bar", 3);
    });
    expect(result.current.get("foo")).toBe(2);
    expect(result.current.get("bar")).toBe(3);
  });

  it("provides the map method", () => {
    const { result } = renderHook(() => useMap());

    act(() => result.current.set("foo", 1));
    act(() => result.current.set("bar", 2));
    act(() => result.current.set("baz", 3));

    const mapped = result.current.map((value, key) => `${key}${value}`);
    expect(mapped).toEqual(["foo1", "bar2", "baz3"]);
  });

  it("does not rerender if the set key have a new value but the reference is the same", () => {
    const { result } = renderHook(() => useMap<string, number>());

    const snapshot = [result.current];
    act(() => result.current.set("foo", 1));
    expect(result.current).not.toBe(snapshot[0]);

    snapshot.push(result.current);
    act(() => result.current.set("foo", 1));
    expect(result.current).toBe(snapshot[1]);

    snapshot.push(result.current);
    act(() => result.current.set("foo", 2));
    expect(result.current).not.toBe(snapshot[2]);
  });

  it("does not rerender if the clear method is called and the map is empty", () => {
    const { result } = renderHook(() => useMap<string, number>());

    const snapshot = [result.current];
    act(() => result.current.clear());
    expect(result.current).toBe(snapshot[0]);

    snapshot.push(result.current);
    act(() => result.current.set("foo", 1));
    expect(result.current).not.toBe(snapshot[1]);

    snapshot.push(result.current);
    act(() => result.current.clear());
    expect(result.current).not.toBe(snapshot[2]);
  });

  it("does not rerender if the delete method is called and the key does not exist", () => {
    const { result } = renderHook(() => useMap<string, number>());

    const snapshot = [result.current];
    act(() => result.current.set("foo", 1));
    expect(result.current).not.toBe(snapshot[0]);

    snapshot.push(result.current);
    act(() => result.current.delete("baz"));
    expect(result.current).toBe(snapshot[1]);

    snapshot.push(result.current);
    act(() => result.current.delete("foo"));
    expect(result.current).not.toBe(snapshot[2]);
  });
});
