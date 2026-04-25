// Helper to recursively find changed paths between two objects.
export function computeJsonDiffPaths(left: any, right: any, basePath: string = ''): Set<string> {
  const paths = new Set<string>();

  if (left === right) return paths;

  if (typeof left !== 'object' || typeof right !== 'object' || left === null || right === null) {
    if (left !== right) {
      paths.add(basePath);
    }
    return paths;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const maxLen = Math.max(left.length, right.length);
    for (let i = 0; i < maxLen; i++) {
      const currentPath = basePath ? `${basePath}[${i}]` : `[${i}]`;
      if (i >= left.length || i >= right.length) {
        paths.add(currentPath);
      } else {
        const subPaths = computeJsonDiffPaths(left[i], right[i], currentPath);
        subPaths.forEach(p => paths.add(p));
      }
    }
    return paths;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  const allKeys = new Set([...leftKeys, ...rightKeys]);

  for (const key of allKeys) {
    const currentPath = basePath ? `${basePath}.${key}` : key;
    if (!left.hasOwnProperty(key) || !right.hasOwnProperty(key)) {
      paths.add(currentPath);
    } else {
      const subPaths = computeJsonDiffPaths(left[key], right[key], currentPath);
      subPaths.forEach(p => paths.add(p));
    }
  }

  return paths;
}

// Function to annotate a JSON object by appending a symbol to keys that have changed
export function annotateJsonForVisualization(obj: any, changedPaths: Set<string>, basePath: string = ''): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item, index) => {
      const currentPath = basePath ? `${basePath}[${index}]` : `[${index}]`;
      return annotateJsonForVisualization(item, changedPaths, currentPath);
    });
  }

  const result: any = {};
  for (const key in obj) {
    const currentPath = basePath ? `${basePath}.${key}` : key;
    let newKey = key;
    if (changedPaths.has(currentPath)) {
      newKey = `🔄 ${key}`; // Using a symbol to highlight changed keys
    }
    result[newKey] = annotateJsonForVisualization(obj[key], changedPaths, currentPath);
  }
  return result;
}
