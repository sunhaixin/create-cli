#!/usr/bin/env node

const program = require('commander')
const package = require('../package.json')

program.version(package.version)
  .usage('<command> [project-name]')
  .description('test')
  .command('init', 'create a new project')

program.on('--help', () => {
  console.log('')
  console.log('Examples:')
  console.log('  $react init project-name')
})

program.parse(process.argv)
