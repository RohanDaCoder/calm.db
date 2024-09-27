import { promises as fs } from "fs";
import path from "path";
import { Database as DatabaseType, Storage } from "./types";

/**
 * A simple file-based key-value database.
 * @implements {DatabaseType}
 */
export class Database implements DatabaseType {
  private filePath: string;
  private storage: Storage;
  private initialized: Promise<void>;

  constructor(filePath: string) {
    if (!filePath) {
      throw new TypeError(
        "[Database] Constructor Error: Missing file path argument."
      );
    }
    this.filePath = path.resolve(__dirname, filePath);
    this.storage = {};
    this.initialized = this._init();
  }

  private async _init(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const data = await fs.readFile(this.filePath, "utf8");
      this.storage = JSON.parse(data);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        await this._write();
      } else {
        throw new Error(`[Database] Initialization Error: ${error.message}`);
      }
    }
  }

  private async _write(): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.storage, null, 4));
    } catch (error: any) {
      throw new Error(`[Database] Write Error: ${error.message}`);
    }
  }

  /**
   * Sets a value for a key in the database.
   * @param {string} key - The key to set.
   * @param {any} value - The value to associate with the key.
   */
  async set(key: string, value: any): Promise<void> {
    await this.initialized;
    if (!key) {
      throw new TypeError("[Database] Error in set function: Invalid key.");
    }
    this.storage[key] = value;
    await this._write();
  }

  /**
   * Retrieves a value by its key from the database.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<any>} - The associated value.
   */
  async get(key: string): Promise<any> {
    await this.initialized;
    if (!key) {
      throw new TypeError("[Database] Error in get function: Invalid key.");
    }
    return this.storage[key];
  }

  /**
   * Checks if a key exists in the database.
   * @param {string} key - The key to check.
   * @returns {Promise<boolean>} - Whether the key exists.
   */
  async has(key: string): Promise<boolean> {
    await this.initialized;
    if (!key) {
      throw new TypeError("[Database] Error in has function: Invalid key.");
    }
    return key in this.storage;
  }

  /**
   * Deletes a key from the database.
   * @param {string} key - The key to delete.
   * @returns {Promise<boolean>} - Whether the key was deleted.
   */
  async delete(key: string): Promise<boolean> {
    await this.initialized;
    if (!key) {
      throw new TypeError("[Database] Error in delete function: Invalid key.");
    }
    if (await this.has(key)) {
      delete this.storage[key];
      await this._write();
      return true;
    }
    return false;
  }

  /**
   * Deletes all data from the database.
   */
  async deleteAll(): Promise<void> {
    await this.initialized;
    this.storage = {};
    await this._write();
  }

  /**
   * Returns the number of keys in the database.
   * @returns {Promise<number>} - The number of keys.
   */
  async size(): Promise<number> {
    await this.initialized;
    return Object.keys(this.storage).length;
  }

  /**
   * Returns all keys from the database.
   * @returns {Promise<string[]>} - The array of keys.
   */
  async keys(): Promise<string[]> {
    await this.initialized;
    return Object.keys(this.storage);
  }

  /**
   * Returns all values from the database.
   * @returns {Promise<any[]>} - The array of values.
   */
  async values(): Promise<any[]> {
    await this.initialized;
    return Object.values(this.storage);
  }

  /**
   * Exports the database content as JSON.
   * @returns {Promise<Storage>} - The database content.
   */
  async toJSON(): Promise<Storage> {
    await this.initialized;
    return { ...this.storage };
  }

  /**
   * Imports data into the database from JSON.
   * @param {Storage} json - The JSON data to import.
   */
  async fromJSON(json: Storage): Promise<void> {
    await this.initialized;
    this.storage = { ...json };
    await this._write();
  }
}
