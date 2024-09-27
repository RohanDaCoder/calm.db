export type Storage = Record<string, any>;

/**
 * The type definition for the Database class.
 */
export interface Database {
  set(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
  has(key: string): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  deleteAll(): Promise<void>;
  size(): Promise<number>;
  keys(): Promise<string[]>;
  values(): Promise<any[]>;
  toJSON(): Promise<Storage>;
  fromJSON(json: Storage): Promise<void>;
}
