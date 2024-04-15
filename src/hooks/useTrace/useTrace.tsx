import { useEffect, useState } from "react";

export function useTrace<T>(value: T, maxLength: number = Infinity): T[] | T {
  const [trace, setTrace] = useState<T[]>([]);

  useEffect(() => {
    setTrace((prev) => {
      const updatedTrace = [value, ...prev];
      return updatedTrace.slice(0, maxLength);
    });
  }, [value, maxLength]);

  return trace;
}
