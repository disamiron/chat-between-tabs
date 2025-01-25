import { Injectable } from '@angular/core';
import { StorageType } from '../types/storage.type';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public setItem(type: StorageType, value: unknown): void {
    localStorage.setItem(type, JSON.stringify(value));
  }

  public getItem<T>(type: StorageType): T | null {
    const item: string | null = localStorage.getItem(type);

    return item ? JSON.parse(item) : null;
  }
}
