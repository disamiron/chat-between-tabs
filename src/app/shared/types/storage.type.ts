export interface Storage<T> {
  type: StorageType;
  value?: T;
}

export enum StorageType {
  history = 'CHAT_BETWEEN_TABS_HISTORY',
}
