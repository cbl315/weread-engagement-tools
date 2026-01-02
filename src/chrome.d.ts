/// <reference lib="dom" />

interface ChromeStorage {
  local: {
    get(keys: string | string[] | null | object): Promise<{ [key: string]: any }>;
    get(keys: string | string[] | null | object, callback: (items: { [key: string]: any }) => void): void;
    set(items: { [key: string]: any }): Promise<void>;
    set(items: { [key: string]: any }, callback?: () => void): void;
  };
}

interface ChromeStorageOnChangedEvent {
  addListener(callback: (changes: { [key: string]: { oldValue?: any; newValue?: any } }, areaName: string) => void): void;
}

interface ChromeStorageArea {
  onChanged: ChromeStorageOnChangedEvent;
}

declare const chrome: {
  storage: ChromeStorage & {
    local: ChromeStorage['local'] & ChromeStorageArea;
  };
};

declare const browser: typeof chrome;

export {};
