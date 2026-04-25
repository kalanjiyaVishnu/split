/**
 * Finds the line number of a specific path in a JSON string.
 * This assumes the JSON is formatted with 2 spaces.
 */
export function findLineNumberForPath(jsonStr: string, path: string): number {
  if (!jsonStr || !path) return 1;

  try {
    const lines = jsonStr.split('\n');
    
    // Normalize path: JSONCrack paths look like "root.items[0].name" or "json.items[0].name"
    // We want to convert this to an array of keys
    const keys = path
      .replace(/\[(\d+)\]/g, '.$1')
      .split('.')
      .filter(k => k && k !== 'root' && k !== 'json');
    
    if (keys.length === 0) return 1;

    let currentLine = 0;
    let tempKeys = [...keys];
    
    // We'll track the depth to handle duplicate keys in different objects
    let depth = 0;
    let foundLine = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const targetKey = tempKeys[0];
      if (!targetKey) break;

      // Check if it's an array index
      const isArrayIndex = !isNaN(Number(targetKey));

      if (isArrayIndex) {
        // If we are looking for an array index, we look for the start of an object or value
        // this is tricky without a real parser, but usually each item starts with { or [ or a value
        if (line.startsWith('{') || line.startsWith('[') || !line.includes(':')) {
           // This is a rough match for an array item
           // In a real app we'd count items, but for now let's try to match the key inside
           tempKeys.shift();
           foundLine = i + 1;
        }
      } else {
        // Match key in quotes followed by colon
        const keyPattern = new RegExp(`"${targetKey}"\\s*:`);
        if (keyPattern.test(line)) {
          foundLine = i + 1;
          tempKeys.shift();
        }
      }
    }

    return foundLine;
  } catch (e) {
    return 1;
  }
}
