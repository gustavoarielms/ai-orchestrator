import { AsyncLocalStorage } from "node:async_hooks";

type RequestStore = {
  requestId: string;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestStore>();

export class RequestContext {
  static run(data: RequestStore, callback: () => void) {
    asyncLocalStorage.run(data, callback);
  }

  static getRequestId(): string | undefined {
    return asyncLocalStorage.getStore()?.requestId;
  }
}