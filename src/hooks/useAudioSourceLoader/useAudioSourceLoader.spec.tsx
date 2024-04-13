import { useAudioSourceLoader } from "./useAudioSourceLoader";
import { renderHook } from "@testing-library/react";

function createMockAudioElement(paused: boolean) {
  return {
    paused: paused,
    load: jest.fn(),
    play: jest.fn(() => Promise.resolve()),
    pause: jest.fn(),
    src: "",
  } as unknown as HTMLAudioElement;
}

describe("useAudioSourceLoader", () => {
  it("does nothing if audio ref is null", () => {
    const audioRef = {
      current: null,
    };
    const dummyBlob = new Blob(["dummy content"], { type: "audio/mp3" });
    const dummyUrl = global.URL.createObjectURL(dummyBlob);

    renderHook(() => useAudioSourceLoader(audioRef, dummyUrl));
    expect(audioRef.current).toBeNull();
  });

  it("sets audio source and loads new audio when provided", () => {
    const audioRef = { current: createMockAudioElement(true) };
    const dummyBlob = new Blob(["dummy content"], { type: "audio/mp3" });
    const dummyUrl = global.URL.createObjectURL(dummyBlob);

    renderHook(() => useAudioSourceLoader(audioRef, dummyUrl));
    expect(audioRef.current?.src).toBe(dummyUrl);
    expect(audioRef.current?.load).toHaveBeenCalledTimes(1);
    expect(audioRef.current?.play).not.toHaveBeenCalled();
  });

  it("pauses, sets source, and reloads if audio is playing", () => {
    const audioRef = { current: createMockAudioElement(false) };
    const dummyBlob = new Blob(["dummy content"], { type: "audio/mp3" });
    const dummyURL = global.URL.createObjectURL(dummyBlob);

    renderHook(() => useAudioSourceLoader(audioRef, dummyURL));
    expect(audioRef.current?.src).toBe(dummyURL);
    expect(audioRef.current?.pause).toHaveBeenCalled();
    expect(audioRef.current?.load).toHaveBeenCalledTimes(1);
    expect(audioRef.current?.play).toHaveBeenCalled();
  });
});
