#!/usr/bin/env node

const program = require('commander')
const packageJson = require('../package.json')

program
  // .option('init', 'create a new project')
  .version(packageJson.version, '-v, --version')
  .parse(process.argv)

program.on('--help', () => {
  console.log('')
  console.log('Examples:')
  console.log('  $ create-app vue project-name')
})
console.log('----args', program.args)

require('./init')
