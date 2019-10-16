#!/usr/bin/env node

const createProject = require('../lib/create-project')
const addRoute = require('../lib/add-route')
const argv = process.argv.slice(2)

const command = argv[0]

async function handleCommand() {
  switch(command) {
    case 'create':
      await createProject(argv[1])
      break
    case 'add-route':
      await addRoute(argv.slice(1))
      break
    default:
      break
  }
}

handleCommand()
  .then(() => {
    process.exit()
  })
