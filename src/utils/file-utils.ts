import * as fs from 'fs';

function readFile(location: string) {
  return fs.readFileSync(location, 'utf8');
}

export { readFile };
