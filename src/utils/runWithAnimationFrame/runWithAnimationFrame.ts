export function runWithAnimationFrame(fn: () => void): () => void {
  let requestId: number;

  const loop = () => {
    fn();
    requestId = requestAnimationFrame(loop);
  };

  requestId = requestAnimationFrame(loop);

  return () => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
  };
}
