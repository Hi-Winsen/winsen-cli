const path = require('path')
const fs = require('fs-extra')
const {getAnswer,rl} = require('../get-answer')

const {
  camelCase,
  formatName,
  formatComponentName
} = require('../utils')

const vueTemplate = fs.readFileSync(path.resolve(__dirname, '../template/component-index.vue'), 'utf-8')
const storeTemplate = fs.readFileSync(path.resolve(__dirname, '../template/store.js'), 'utf-8')
const apiTemplate = fs.readFileSync(path.resolve(__dirname, '../template/api.js'), 'utf-8')
const {firstLevelRoute} = require(path.resolve(__dirname, '../template/router.js'))
const addSecondRouter = require('./add-second-router')

let firstLevel = ''
let secondLevel = ''

module.exports = async function(params = []) {
  const {length} = params
  if (length === 0) {
    firstLevel = await getAnswer('请填写一级页面: ')
    secondLevel = await getAnswer('请填写二级页面(可不填): ')
  } else if (length === 1) {
    firstLevel = params[0]
    secondLevel = await getAnswer('请填写二级页面(可不填): ')
  } else {
    firstLevel = params[0]
    secondLevel = params[1]
  }
  rl.close()
  firstLevel = formatName(firstLevel)
  secondLevel = formatName(secondLevel)

  const firstLevelPath = path.resolve('src/views', firstLevel)
  // 一级、二级目录都要存在，如果不存在，新建一个
  fs.ensureDirSync(path.resolve(firstLevelPath, 'pages', secondLevel))

  // 检查一级页面的 index 文件是否存在，如果不存在，按照模板添加一个
  const firstLevelFile = path.resolve(firstLevelPath, `${formatComponentName(firstLevel)}.index.vue`)
  if (!fs.existsSync(firstLevelFile)) {
    fs.ensureFileSync(firstLevelFile)
    const firstLevelTemplate = vueTemplate.replace(/winsen-cli-component-name/g, firstLevel)
    fs.outputFileSync(firstLevelFile, firstLevelTemplate)
  }

  // 新建 components 文件夹（如果不存在的话）
  fs.ensureDirSync(path.resolve(firstLevelPath, 'components'))

  // 检查 store 文件是否存在，如果不存在，按照模板添加一个
  const storeFile = path.resolve(firstLevelPath, `store-router/store.js`)
  if (!fs.existsSync(storeFile)) {
    fs.ensureFileSync(storeFile)
    const newStoreTemplate = storeTemplate.replace(/___this_name_will_replace_again___/g, camelCase(firstLevel))
    fs.outputFileSync(storeFile, newStoreTemplate)
  }

  // 检查 api 文件是否存在，如果不存在，按照模板添加一个
  const apiFile = path.resolve(firstLevelPath, `store-router/api.js`)
  if (!fs.existsSync(apiFile)) {
    fs.ensureFileSync(apiFile)
    fs.outputFileSync(apiFile, apiTemplate)
  }

  // 插入一级页面路由
  const routerFile = path.resolve(firstLevelPath, 'store-router/router.js')
  let routerFileStr = ''
  if (!fs.existsSync(routerFile)) {
    fs.ensureFileSync(routerFile)
    routerFileStr = firstLevelRoute
      .replace(/firstLevelComponentName/g, formatComponentName(firstLevel))
      .replace(/firstLevelName/g, camelCase(firstLevel))
      .replace(/firstLevel/g, firstLevel)
  } else {
    routerFileStr = fs.readFileSync(routerFile, 'utf-8')
  }
  // 插入二级页面路由
  if (secondLevel) {
    routerFileStr = addSecondRouter({
      firstLevel,
      secondLevel,
      routerFileStr
    })
  }
  fs.outputFileSync(routerFile, routerFileStr)


  // 检查二级页面的 index 文件是否存在，如果不存在，按照模板新建一个
  const secondLevelFile = path.resolve(firstLevelPath, 'pages', secondLevel, `${formatComponentName(secondLevel)}.index.vue`)
  fs.ensureFileSync(secondLevelFile)
  const secondLevelTemplate = vueTemplate.replace(/winsen-cli-component-name/g, secondLevel)
  fs.outputFileSync(secondLevelFile, secondLevelTemplate)
}