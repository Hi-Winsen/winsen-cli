#!/usr/bin/env node

'use strict'

const cloneProject = require('./clone-project')
const getStdinParams = require('./get-stdin-params')

module.exports = async function(projectName) {
  if (projectName) {
    await cloneProject(projectName)
  } else {
    const questionList = await getStdinParams()
    await cloneProject(questionList.projectName.answer)
    return
  }
}
