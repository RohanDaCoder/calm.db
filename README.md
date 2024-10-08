# calm.db

calm.db is a zero-dependency, lightweight JSON-based database for Node.js applications. It provides methods to easily store, retrieve, and manipulate data, now including CSV import and export capabilities.

## Installation

You can install calm.db via npm:

```bash
npm install calm.db
```

## Usage

### Initialize calm.db

```javascript
const Database = require("calm.db");

// Initialize calm.db with a file path
const db = new Database("data/db.json");
```

### Setting Data

```javascript
// Set key-value pair
await db.set("key1", "value1");
```

### Getting Data

```javascript
// Get value by key
const value = await db.get("key1");
console.log(value); // Output: 'value1'
```

### Checking Existence

```javascript
// Check if key exists
const exists = await db.has("key1");
console.log(exists); // Output: true
```

### Deleting Data

```javascript
// Delete data by key
const deleted = await db.delete("key1");
console.log(deleted); // Output: true (if successful)
```

### Other Operations

```javascript
// Get all keys
const keys = await db.keys();
console.log(keys); // Output: ['key1', 'key2', 'key3']

// Get all values
const values = await db.values();
console.log(values); // Output: ['value1', 'value2', 'value3']

// Get the number of entries
const count = await db.size();
console.log(count); // Output: 3
```

### JSON Operations

```javascript
// Convert database to JSON object
const json = await db.toJSON();
console.log(json); // Output: { key1: 'value1', key2: 'value2', key3: 'value3' }

// Load JSON data into database
const newData = { key4: "value4", key5: "value5" };
await db.fromJSON(newData);
```

### Exporting and Importing CSV

```javascript
// Export database to CSV string
const csvString = await db.toCSV();
console.log(csvString);

// Import CSV string into database
const newCSVData = `
key,value
key2,value2
key3,value3
`;
await db.fromCSV(newCSVData);
```

### Searching with Filters

```javascript
// Find entries based on a filter function
const filtered = await db.find((key, value) => key.startsWith("key"));
console.log(filtered); // Output: [['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']]
```

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for any improvements or bug fixes.

## License

MIT License. See the [LICENSE](./LICENSE) file for details.

---

© 2024 RohanDaCoder (Discord: rohan_ohio)
