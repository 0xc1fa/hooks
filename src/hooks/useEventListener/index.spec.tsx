import { useRef } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { useEventListener } from ".";
import "@testing-library/jest-dom";

function TestComponent1({ type, onEvent }: { type: string; onEvent: any }) {
  const ref = useRef<HTMLDivElement>(null);
  useEventListener(ref, type as any, onEvent);

  return <div ref={ref} data-testid="test-element" />;
}

function TestComponent2({ type, onEvent }: { type: string; onEvent: any }) {
  useEventListener(document, type as any, onEvent);

  return <></>;
}

describe("useEventListener", () => {
  it("registers an event listener on a DOM element identified by ref.", () => {
    const handler = jest.fn();
    render(<TestComponent1 type="click" onEvent={handler} />);
    const element = screen.getByTestId("test-element");

    fireEvent.click(element);

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it("registers an event listener on a direct DOM object.", () => {
    const handler = jest.fn();
    render(<TestComponent2 type="click" onEvent={handler} />);
    fireEvent.click(document);
    expect(handler).toHaveBeenCalled();
  });

  it("maintains the same event listener across re-renders.", () => {
    const handler = jest.fn();
    const { rerender } = render(
      <TestComponent1 type="click" onEvent={handler} />
    );
    const element = screen.getByTestId("test-element");

    rerender(<TestComponent1 type="click" onEvent={handler} />);

    fireEvent.click(element);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("removes the registered event listener upon unmounting.", () => {
    const handler = jest.fn();
    const { unmount } = render(
      <TestComponent1 type="click" onEvent={handler} />
    );
    unmount();

    fireEvent.click(document);
    expect(handler).not.toHaveBeenCalled();
  });
});
