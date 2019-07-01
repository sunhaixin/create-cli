const program = require('commander')
const fs = require('fs')
const path = require('path')
const prompt = require('prompt')
const colors = require('colors')
const download = require('../lib/download')
const CONFIG = require('../config')

class Init {
  constructor () {
    this.firstSchemaConfirm = {
      name: 'confirm',
      description: ''
    }
    this.secondSchemaConfirm = {
      name: 'projectName',
      description: colors.reset('请重新输入项目名称')
    }
    this.type = 'react'
    this.start()
  }

  start () {
    const [type, projectName] = program.args
    const isSuppoerted = Object.getOwnPropertyNames(CONFIG).indexOf(type) > -1

    if (!type) {
      console.log(colors.red('Error: 请输入模版类型'))
      return
    }

    if (!isSuppoerted) {
      console.log(colors.red('Error: 暂不支持该类型框架'))
      return
    }

    this.type = type

    prompt.start()
    this.promptget(projectName)
  }

  promptget (projectName) {
    if (!projectName) {
      this.firstSchemaConfirm.description = colors.reset('确定在 当前目录 创建项目？ y/n')
    } else {
      this.firstSchemaConfirm.description = colors.reset(`确定使用 ${projectName} 为项目名称？ y/n`)
    }
    prompt.get(this.firstSchemaConfirm, (err, confirmRes) => {
      if (err) { return }

      if (confirmRes && (confirmRes.confirm === 'y' || confirmRes.confirm === '')) {
        this.resolve(projectName)
      } else {
        prompt.get(this.secondSchemaConfirm, (err, projectNameRes) => {
          if (err) { return }
          if (projectNameRes) {
            this.promptget(projectNameRes.projectName)
          }
        })
      }
    })
  }

  resolve (projectName) {
    projectName = projectName ? projectName : ''
    const projectPath = path.resolve(process.cwd(), projectName)
    const isExistDir = projectName && fs.existsSync(projectPath)

    if (isExistDir) {
      console.log('当前项目已存在！')
      process.exit(1)
    }

    if (projectName) {
      fs.mkdirSync(projectPath)
    }

    const config = CONFIG[this.type]

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
