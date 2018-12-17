const program = require('commander')
const ora = require('ora')
const fs = require('fs')
const path = require('path')
const download = require('../lib/download')

program.parse(process.argv)

const projectName = program.args[0]

if (!projectName) {
  program.help()
  return
}

const projectPath = path.resolve(process.cwd(), projectName)
const isExistDir = fs.existsSync(projectPath)

if (isExistDir) {
  console.log('当前文件夹已存在！')
  process.exit(1)
}

ora({ color: 'yellow', text: 'Creating Directory...' })
fs.mkdirSync(projectPath)
download(projectPath).then(() => {
  const packagePath = path.resolve(projectPath, 'package.json')
  const packageJson = fs.readFileSync(packagePath).toString()
  const parseJson = JSON.parse(packageJson)
  
  if (parseJson) {
    parseJson.name = projectName
  }
  fs.writeFileSync(packagePath, JSON.stringify(parseJson, null, '\t'))
  console.log('Finished')
})
.catch(err => {
  console.log('error: ', err)
})
