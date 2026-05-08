const fs = require('fs');
const path = require('path');
const vm = require('vm');

function extractExportedArray(filePath, exportName) {
  const source = fs.readFileSync(filePath, 'utf8');
  const exportIndex = source.indexOf(`export const ${exportName}`);

  if (exportIndex === -1) {
    throw new Error(`Could not find export "${exportName}" in ${filePath}`);
  }

  const equalsIndex = source.indexOf('=', exportIndex);
  if (equalsIndex === -1) throw new Error(`Could not find assignment for ${exportName}`);

  const start = source.indexOf('[', equalsIndex);
  if (start === -1) throw new Error(`Could not find array start for ${exportName}`);

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '[') depth += 1;
    if (char === ']') depth -= 1;

    if (depth === 0) {
      const arrayLiteral = source.slice(start, index + 1);
      return vm.runInNewContext(arrayLiteral, {}, { timeout: 1000 });
    }
  }

  throw new Error(`Could not find array end for ${exportName}`);
}

function loadFrontendCatalog(rootDir = path.resolve(__dirname, '..', '..', '..')) {
  return {
    activities: extractExportedArray(path.join(rootDir, 'src', 'data', 'activities.ts'), 'activities'),
    hotels: extractExportedArray(path.join(rootDir, 'src', 'data', 'hotels.ts'), 'hotels'),
    restaurants: extractExportedArray(path.join(rootDir, 'src', 'data', 'restaurants.ts'), 'restaurants')
  };
}

module.exports = { loadFrontendCatalog };
