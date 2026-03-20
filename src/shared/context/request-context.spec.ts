import { RequestContext } from "./request-context";

describe("RequestContext", () => {
  it("should store and retrieve requestId", () => {
    RequestContext.run({ requestId: "test-123" }, () => {
      const requestId = RequestContext.getRequestId();
      expect(requestId).toBe("test-123");
    });
  });

  it("should return undefined outside context", () => {
    const requestId = RequestContext.getRequestId();
    expect(requestId).toBeUndefined();
  });

  it("should not leak context between executions", () => {
    RequestContext.run({ requestId: "first" }, () => {
      expect(RequestContext.getRequestId()).toBe("first");
    });

    RequestContext.run({ requestId: "second" }, () => {
      expect(RequestContext.getRequestId()).toBe("second");
    });
  });
});