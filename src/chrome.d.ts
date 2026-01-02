declare const chrome: {
  storage: {
    local: {
      get(keys: string | string[] | null): Promise<Record<string, any>>;
      set(items: Record<string, any>): Promise<void>;
    }
  };
  runtime: {
    lastError?: Error;
  }
};

declare const browser: typeof chrome;

export {};
