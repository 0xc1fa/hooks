// import { fireEvent, waitFor } from "@testing-library/react";
// import { renderHook, act } from "@testing-library/react";
// import { PointerActiveInfo, usePointerDraggingListener } from ".";

// describe("useActivePointerState", () => {
//   let ref: { current: HTMLDivElement };
//   let result: { current: PointerActiveInfo };
//   let unmount: () => void;

//   beforeEach(() => {
//     ref = { current: document.createElement("div") };
//     ({ result, unmount } = renderHook(() => useActivePointerState(ref)));
//   });

//   test("initializes as inactive", () => {
//     expect(result.current.isPointerDown).toBe(false);
//   });

//   test("activates on pointerdown", () => {
//     act(() => fireEvent.pointerDown(ref.current));
//     expect(result.current.isPointerDown).toBe(true);
//   });

//   test("deactivates on pointerup", () => {
//     act(() => fireEvent.pointerDown(ref.current));
//     act(() => fireEvent.pointerUp(document));
//     expect(result.current.isPointerDown).toBe(false);
//   });

//   test("deactivates on pointercancel", () => {
//     act(() => fireEvent.pointerDown(ref.current));
//     act(() => fireEvent.pointerCancel(document));
//     expect(result.current.isPointerDown).toBe(false);
//   });

//   test("deactivates upon unmounting", () => {
//     act(() => fireEvent.pointerDown(ref.current));
//     unmount();
//     waitFor(() => !result.current.isPointerDown).then(() =>
//       expect(result.current.isPointerDown).toBe(false)
//     );
//   });
// });
