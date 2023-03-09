const path = require('path');
const fs = require('fs');

const packageJson = require('../package.json');

packageJson.main = 'dist';
packageJson.types = 'dist';

fs.writeFileSync(
  path.resolve(__dirname, '..', 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n',
  {
    encoding: 'utf-8',
  },
);
