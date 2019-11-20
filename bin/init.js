#!/usr/bin/env node

const createProject = require('../lib/create-project')
const addPages = require('../lib/add-pages/index')
const argv = process.argv.slice(2)

const command = argv[0]

async function handleCommand() {
  switch(command) {
    case 'create':
      await createProject(argv[1])
      break
    case 'add-pages':
      await addPages(argv.slice(1)).catch(err => {
        console.log(err)
      })
      break
    default:
      break
  }
}

handleCommand()
  .then(() => {
    process.exit()
  })
