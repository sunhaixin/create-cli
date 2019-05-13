const download = require('download-git-repo')
const ora = require('ora')

module.exports = (target, CONFIG) => {
  const spinner = ora({color: 'yellow', text: 'Downloading Template...' })
  spinner.start()
  return new Promise((resolve, reject) => {
    download(`${CONFIG.authorID}/${CONFIG.templateName}#${CONFIG.branch}`, target, err => {
      if (err) {
        spinner.fail()
        reject(err)
      } else {
        spinner.succeed('Template file is downloaded successfully')
        resolve()
      }
    })
  })
}