/**
 * @jest-environment jsdom
 */

import { useIsomorphicLayoutEffect } from ".";
import { useLayoutEffect } from "react";

describe("useIsomorphicLayoutEffect", () => {
  it("uses useLayoutEffect when window is defined", () => {
    expect(global.window).toBeDefined();
    expect(useIsomorphicLayoutEffect).toEqual(useLayoutEffect);
  });
});
