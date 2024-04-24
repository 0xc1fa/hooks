export { useUnmount };

import { useEffect } from "react";

function useUnmount(callback: () => void) {
  useEffect(() => callback, []);
}
