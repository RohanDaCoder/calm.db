const fs = require("fs").promises;
const path = require("path");

class Database {
  constructor(filePath) {
    if (!filePath) {
      throw new TypeError(
        "[Database] Constructor Error: Missing file path argument.",
      );
    }
    this.filePath = path.resolve(__dirname, filePath);
    this.storage = {};
    this.initialized = this._init();
  }

  async _init() {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      const data = await fs.readFile(this.filePath, "utf8");
      this.storage = JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this._write();
      } else {
        throw new Error(
          `[Database] Initialization Error: Failed to read from file - ${error.message}`,
        );
      }
    }
  }

  async _write() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.storage, null, 4));
    } catch (error) {
      throw new Error(
        `[Database] Write Error: Failed to write to file - ${error.message}`,
      );
    }
  }

  async set(key, value) {
    await this.initialized;
    if (key === null || key === undefined || key === "") {
      throw new TypeError(
        "[Database] Error in set function: Invalid key. Key must be a non-empty string or number.",
      );
    }
    try {
      this.storage[key] = value;
      await this._write();
    } catch (error) {
      throw new Error(`[Database] Error in set function: ${error.message}`);
    }
  }

  async get(key) {
    await this.initialized;
    if (key === null || key === undefined || key === "") {
      throw new TypeError(
        "[Database] Error in get function: Invalid key. Key must be a non-empty string or number.",
      );
    }
    try {
      return this.storage[key];
    } catch (error) {
      throw new Error(`[Database] Error in get function: ${error.message}`);
    }
  }

  async has(key) {
    await this.initialized;
    if (key === null || key === undefined || key === "") {
      throw new TypeError(
        "[Database] Error in has function: Invalid key. Key must be a non-empty string or number.",
      );
    }
    try {
      return key in this.storage;
    } catch (error) {
      throw new Error(`[Database] Error in has function: ${error.message}`);
    }
  }

  async delete(key) {
    await this.initialized;
    if (key === null || key === undefined || key === "") {
      throw new TypeError(
        "[Database] Error in delete function: Invalid key. Key must be a non-empty string or number.",
      );
    }
    try {
      if (await this.has(key)) {
        delete this.storage[key];
        await this._write();
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(`[Database] Error in delete function: ${error.message}`);
    }
  }

  async deleteAll() {
    await this.initialized;
    try {
      this.storage = {};
      await this._write();
    } catch (error) {
      throw new Error(
        `[Database] Error in deleteAll function: ${error.message}`,
      );
    }
  }

  async toJSON() {
    await this.initialized;
    try {
      return { ...this.storage };
    } catch (error) {
      throw new Error(`[Database] Error in toJSON function: ${error.message}`);
    }
  }

  async fromJSON(json) {
    await this.initialized;
    try {
      this.storage = JSON.parse(JSON.stringify(json));
      await this._write();
    } catch (error) {
      throw new TypeError(
        `[Database] Error in fromJSON function: Invalid JSON data - ${error.message}`,
      );
    }
  }

  async toCSV() {
    await this.initialized;
    try {
      let csv = "key,value\n";
      Object.entries(this.storage).forEach(([key, value]) => {
        csv += `${key},${value}\n`;
      });
      return csv.trim();
    } catch (error) {
      throw new Error(`[Database] Error in toCSV function: ${error.message}`);
    }
  }

  async fromCSV(csvString) {
    try {
      const lines = csvString
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");
      const headers = lines.shift().split(",");
      if (
        headers.length !== 2 ||
        headers[0] !== "key" ||
        headers[1] !== "value"
      ) {
        throw new Error("Invalid CSV format. Expected header: 'key,value'");
      }
      this.storage = {};
      lines.forEach((line) => {
        const [key, value] = line.split(",");
        this.storage[key] = value;
      });
      await this._write();
    } catch (error) {
      throw new Error(`[Database] Error in fromCSV function: ${error.message}`);
    }
  }

  async find(filterFn) {
    await this.initialized;
    if (filterFn && typeof filterFn !== "function") {
      throw new TypeError(
        "[Database] Error in find function: Filter must be a function.",
      );
    }
    try {
      if (filterFn) {
        return Object.entries(this.storage).filter(([key, value]) =>
          filterFn(key, value),
        );
      } else {
        return Object.entries(this.storage);
      }
    } catch (error) {
      throw new Error(`[Database] Error in find function: ${error.message}`);
    }
  }

  async size() {
    await this.initialized;
    try {
      return Object.keys(this.storage).length;
    } catch (error) {
      throw new Error(`[Database] Error in size function: ${error.message}`);
    }
  }

  async keys() {
    await this.initialized;
    try {
      return Object.keys(this.storage);
    } catch (error) {
      throw new Error(`[Database] Error in keys function: ${error.message}`);
    }
  }

  async values() {
    await this.initialized;
    try {
      return Object.values(this.storage);
    } catch (error) {
      throw new Error(`[Database] Error in values function: ${error.message}`);
    }
  }
}

module.exports = Database;
