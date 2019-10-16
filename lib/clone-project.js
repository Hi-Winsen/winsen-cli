const {exec} = require('child_process')
module.exports = function(projectName) {
  exec(`git clone git@github.com:Hi-Winsen/vue-project-template.git ${projectName}`, (error, stdout, stderr) => {
    if (error) {
      return console.log(error)
    }
    console.log(stdout)
  })
}
