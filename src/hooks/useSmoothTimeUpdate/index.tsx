export { useSmoothTimeUpdate };

import { runWithAnimationFrame } from "@/utils/runWithAnimationFrame";
import { useEffect } from "react";

function useSmoothTimeUpdate(
  audioRef: React.RefObject<HTMLAudioElement | HTMLVideoElement>
) {
  useEffect(() => {
    const stop = runWithAnimationFrame(() => {
      if (!audioRef.current?.paused) {
        audioRef.current?.dispatchEvent(new Event("timeupdate"));
      }
    });

    return stop;
  }, []);
}
