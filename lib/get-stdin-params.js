const getAnswer = require('./get-answer')

const questionList = {
  projectName: {
    question: '请输入您的项目名称？',
    answer: ''
  },
  others: {
    question: '还有什么要说的？',
    answer: ''
  }
}

module.exports = async function() {
  return new Promise(async (resolve, reject) => {
    for (const key in questionList) {
      if (questionList.hasOwnProperty(key)) {
        const questionItem = questionList[key]
        questionItem.answer = await getAnswer(questionItem.question)
      }
    }
    rl.close()
    resolve(questionList)
  })
}
