const program = require('commander')
const ora = require('ora')
const fs = require('fs')
const path = require('path')
const prompt = require('prompt')
const colors = require('colors')
const download = require('../lib/download')
const CONFIG = require('../config')


class Init {
  constructor () {
    this.start()
  }

  start () {
    const support = CONFIG.support
    const [type, projectName] = program.args
    const isSuppoerted = (support.indexOf(type)) > -1

    if (!isSuppoerted) {
      console.log(colors.red('Error: 暂不支持该类型框架！'))
      return
    }

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
        this.resolve(projectName, type)
      } else {
        prompt.get(schemaProjectName, (err, projectNameRes) => {
          if (projectNameRes && projectNameRes.projectName) {
            this.resolve(projectNameRes.projectName, type)
          }
        })
      }
    })
  }

  resolve (projectName, type) {
    const projectPath = path.resolve(process.cwd(), projectName)
    const isExistDir = fs.existsSync(projectPath)

    if (isExistDir) {
      console.log('当前项目已存在！')
      process.exit(1)
    }

    ora({ color: 'yellow', text: 'Creating Directory...' })
    fs.mkdirSync(projectPath)

    const config = CONFIG[type]

    download(projectPath, config)
      .then(() => {
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
}

new Init()
