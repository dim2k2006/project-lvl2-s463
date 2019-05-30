#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';

program
  .version('1.0.0')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((path1, path2, options = {}) => {
    const { format } = options;

    console.log(genDiff(format, path1, path2));
  })
  .parse(process.argv);
