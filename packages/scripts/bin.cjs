#!/usr/bin/env node

const path = require('node:path');
const jiti = require('jiti')(__filename);

jiti(path.resolve(__dirname, './src/index.ts'));
