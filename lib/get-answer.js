const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

module.exports = async function(question) {
  return new Promise(resolve => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}
