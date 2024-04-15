import { act, renderHook } from "@testing-library/react";
import { useTrace } from "./useTrace";
import { Dispatch, SetStateAction, useState } from "react";

describe("useTrace", () => {
  it("initializes with the specified initial value", () => {
    let state;
    const { result } = renderHook(() => {
      const [state, setState] = useState(10);
      return useTrace(state);
    });
    expect(result.current).toEqual([10]);
  });

  it("updates and retains new values in history", () => {
    let state: number;
    let setState: Dispatch<SetStateAction<number>>;
    const { result } = renderHook(() => {
      [state, setState] = useState(0);
      return useTrace(state);
    });
    expect(result.current).toEqual([0]);
    act(() => setState(1));
    expect(result.current).toEqual([1, 0]);
    act(() => setState(2));
    expect(result.current).toEqual([2, 1, 0]);
  });

  it("limits the history length to the specified maximum", () => {
    let state: number;
    let setState: Dispatch<SetStateAction<number>>;
    const { result } = renderHook(() => {
      [state, setState] = useState(0);
      return useTrace(state, 2);
    });
    expect(result.current).toEqual([0]);
    act(() => setState(1));
    expect(result.current).toEqual([1, 0]);
    act(() => setState(2));
    expect(result.current).toEqual([2, 1]);
    act(() => setState(3));
    expect(result.current).toEqual([3, 2]);
  });

  it("excludes the bailout value from the history", () => {
    let state: number;
    let setState: Dispatch<SetStateAction<number>>;
    const { result } = renderHook(() => {
      [state, setState] = useState(0);
      return useTrace(state, 2);
    });
    expect(result.current).toEqual([0]);
    act(() => setState(1));
    expect(result.current).toEqual([1, 0]);
    act(() => setState(1));
    expect(result.current).toEqual([1, 0]);
    act(() => setState(0));
    expect(result.current).toEqual([0, 1]);
    act(() => setState(0));
    expect(result.current).toEqual([0, 1]);
    act(() => setState(2));
    expect(result.current).toEqual([2, 0]);
  });
});
