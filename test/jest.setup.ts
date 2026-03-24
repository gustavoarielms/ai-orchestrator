import { Logger } from "../src/shared/logger/logger";

beforeEach(() => {
  jest.spyOn(Logger, "log").mockImplementation(() => {});
  jest.spyOn(Logger, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});
