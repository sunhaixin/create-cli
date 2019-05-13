const program = require('commander')
const ora = require('ora')
const fs = require('fs')
const path = require('path')
const prompt = require('prompt')
const colors = require('colors')
const download = require('../lib/download')


function resolve(projectName) {
  const projectPath = path.resolve(process.cwd(), projectName)
  const isExistDir = fs.existsSync(projectPath)

  if (isExistDir) {
    console.log('当前项目已存在！')
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
    console.log('Finished!')
  })
    .catch(err => {
      colors.red('Error: ', err)
    })
}

const projectName = program.args[0]
const schemaConfirm = {
  name: 'confirm',
  description: colors.reset(`确定使用 ${projectName} 为项目名称？ y/n`)
}
const schemaProjectName = {
  name: 'projectName',
  description: colors.reset('请重新输入项目名称')
}

prompt.start()
prompt.get(schemaConfirm, (err, confirmRes) => {
  if (confirmRes && (confirmRes.confirm === 'y' || confirmRes.confirm === '')) {
    resolve(projectName)
  } else {
    prompt.get(schemaProjectName, (err, projectNameRes) => {
      if (projectNameRes && projectNameRes.projectName) {
        resolve(projectNameRes.projectName)
      }
    })
  }
})
