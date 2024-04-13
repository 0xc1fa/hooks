/**
 * @jest-environment node
 */

import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { useEffect } from "react";

describe("useIsomorphicLayoutEffect", () => {
  it("uses useEffect when window is not defined", () => {
    expect(global.window).toBeUndefined();
    expect(useIsomorphicLayoutEffect).toEqual(useEffect);
  });
});
