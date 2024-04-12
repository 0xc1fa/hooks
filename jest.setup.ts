jest.spyOn(global, "requestAnimationFrame").mockImplementation((fn) => {
  return setTimeout(fn, 1000 / 60);
});
jest.spyOn(global, "cancelAnimationFrame").mockImplementation((id) => {
  clearTimeout(id);
});
