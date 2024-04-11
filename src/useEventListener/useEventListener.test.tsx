import { useRef } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { useEventListener } from "./useEventListener";

function TestComponent({ type, onEvent }: { type: string; onEvent: any }) {
  const ref = useRef<HTMLDivElement>(null);
  useEventListener(ref, type as any, onEvent);

  return <div ref={ref} data-testid="test-element" />;
}

describe("useEventListener", () => {
  it("should attach and handle event", () => {
    const handler = jest.fn();
    render(<TestComponent type="click" onEvent={handler} />);
    const element = screen.getByTestId("test-element");

    fireEvent.click(element);

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it("should keep the same event listener on rerender", () => {
    const handler = jest.fn();
    const { rerender } = render(
      <TestComponent type="click" onEvent={handler} />
    );
    const element = screen.getByTestId("test-element");

    rerender(<TestComponent type="click" onEvent={handler} />);

    fireEvent.click(element);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should clean up event listener on unmount", () => {
    const handler = jest.fn();
    const { unmount } = render(
      <TestComponent type="click" onEvent={handler} />
    );
    unmount();

    fireEvent.click(document);
    expect(handler).not.toHaveBeenCalled();
  });
});
