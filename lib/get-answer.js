const readline = require('readline')

exports.rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

exports.getAnswer = async function(question) {
  return new Promise(resolve => {
    exports.rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}
