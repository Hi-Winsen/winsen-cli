#!/usr/bin/env node

'use strict'

const {getAnswer, rl} = require('./get-answer')

const {exec} = require('child_process')
async function cloneProject(projectName) {
  return new Promise((resolve, reject) => {
    exec(`git clone git@github.com:Hi-Winsen/vue-project-template.git ${projectName}`, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      if (stderr) resolve(stderr)
      else if (stdout) resolve(stdout)
    })
  })
}

module.exports = async function(projectName) {
  if (!projectName) {
    projectName = await getAnswer('请输入您的项目名称：')
    rl.close()
  }
  const childLog = await cloneProject(projectName)
  console.log(childLog)
  return
}
