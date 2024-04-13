if (process.env.JEST_ENVIRONMENT === "jsdom") {
  jest.spyOn(global, "requestAnimationFrame").mockImplementation((fn) => {
    return setTimeout(fn, 1000 / 60);
  });
  jest.spyOn(global, "cancelAnimationFrame").mockImplementation((id) => {
    clearTimeout(id);
  });
}

import { v4 as uuidv4 } from "uuid";
global.URL.createObjectURL = jest.fn((obj) => {
  if (!(obj instanceof Blob || obj instanceof MediaSource)) {
    throw new Error("Invalid object type");
  }
  return obj instanceof Blob
    ? `blob:domain.test/${uuidv4()}`
    : `media:domain.test/${uuidv4()}`;
});
