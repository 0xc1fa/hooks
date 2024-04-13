import { runWithAnimationFrame } from "./runWithAnimationFrame";

describe("runWithAnimationFrame", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  test("the fn should run after one render", () => {
    const cb = jest.fn();
    runWithAnimationFrame(cb);
    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000 / 60);
    expect(cb).toHaveBeenCalled();
  });

  test("the fn should run every frame", () => {
    const cb = jest.fn();
    runWithAnimationFrame(cb);
    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000 / 60);
    expect(cb).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000 / 60);
    expect(cb).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(1000 / 60);
    expect(cb).toHaveBeenCalledTimes(3);
  });

  test("the fn should stop running if it is canceled", () => {
    const cb = jest.fn();
    const cancel = runWithAnimationFrame(cb);
    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000 / 120);
    cancel();
    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000 / 60);
    expect(cb).not.toHaveBeenCalled();
  });
});
