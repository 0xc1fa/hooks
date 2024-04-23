export { useAudioSourceLoader };

import { useEffect } from "react";

function useAudioSourceLoader(
  ref: React.RefObject<HTMLAudioElement>,
  src: string | null
) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (src) {
      if (ref.current.paused) {
        ref.current.src = src;
        ref.current.load();
      } else {
        ref.current.src = src;
        ref.current.pause();
        ref.current.load();
        ref.current.play();
      }
    }
  }, [src]);
}
