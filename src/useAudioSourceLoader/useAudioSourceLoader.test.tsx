import { useAudioSourceLoader } from "./useAudioSourceLoader";
import { useObjectURL, type ObjectWithURL } from "../useObjectURL";
import { renderHook } from "@testing-library/react";
import { RefObject } from "react";

describe("useAudioSourceLoader", () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => "mockAudioUrl");
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

  it("does nothing if audio ref is null", () => {
    const audioRef = {
      current: null,
    };

    const blobWithUrl: ObjectWithURL<Blob> = {
      obj: new Blob(["dummy content"], { type: "audio/mp3" }),
      url: "mockAudioUrl",
    };

    renderHook(() => useAudioSourceLoader(audioRef, blobWithUrl.url));
    expect(audioRef.current).toBeNull();
    jest.resetAllMocks();
  });

  it("sets audio source and loads new audio when provided", () => {
   const audioRef = {
      current: {
        paused: true,
        load: jest.fn(),
        play: jest.fn(() => Promise.resolve()),
        pause: jest.fn(),
        src: "",
      },
    } as unknown as RefObject<HTMLAudioElement>;

    const dummyBlob = new Blob(["dummy content"], { type: "audio/mp3" });
    const { result } = renderHook(() => useObjectURL(dummyBlob));

    const blobWithUrl: ObjectWithURL<Blob> | null = result.current[0];
    if (!blobWithUrl) {
      throw new Error("blobWithUrl is null");
    }
    renderHook(() => useAudioSourceLoader(audioRef, blobWithUrl.url));
    expect(audioRef.current?.src).toBe(blobWithUrl.url);
    expect(audioRef.current?.load).toHaveBeenCalledTimes(1);
    expect(audioRef.current?.play).not.toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it("pauses, sets source, and reloads if audio is playing", () => {
    const audioRef = {
      current: {
        paused: false,
        load: jest.fn(),
        play: jest.fn(() => Promise.resolve()),
        pause: jest.fn(),
        src: "",
      },
    } as unknown as RefObject<HTMLAudioElement>;
    const dummyBlob = new Blob(["dummy content"], { type: "audio/mp3" });
    const { result } = renderHook(() => useObjectURL(dummyBlob));

    const blobWithUrl: ObjectWithURL<Blob> | null = result.current[0];
    if (!blobWithUrl) {
      throw new Error("blobWithUrl is null");
    }
    renderHook(() => useAudioSourceLoader(audioRef, blobWithUrl.url));
    expect(audioRef.current?.src).toBe(blobWithUrl.url);
    expect(audioRef.current?.pause).toHaveBeenCalled();
    expect(audioRef.current?.load).toHaveBeenCalledTimes(1);
    expect(audioRef.current?.play).toHaveBeenCalled();
    jest.resetAllMocks();
  });
});
