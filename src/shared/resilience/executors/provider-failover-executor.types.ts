export type ProviderExecutionFn<T> = () => Promise<T>;

export type ExecuteWithFailoverParams<T> = {
  primaryProviderName: string;
  fallbackProviderName: string;
  fallbackEnabled: boolean;
  executePrimary: ProviderExecutionFn<T>;
  executeFallback: ProviderExecutionFn<T>;
};