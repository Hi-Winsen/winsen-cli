const path = require('path')
const fs = require('fs-extra')
const getAnswer = require('./get-answer')

const {
  camelCase,
  formatName,
  formatComponentName
} = require('./utils')

const vueTemplate = fs.readFileSync(path.resolve(__dirname, './template/component-index.vue'), 'utf-8')
const storeTemplate = fs.readFileSync(path.resolve(__dirname, './template/store.js'), 'utf-8')
const apiTemplate = fs.readFileSync(path.resolve(__dirname, './template/api.js'), 'utf-8')
const {
  firstLevelRoute,
  secondLevelRoute
} = require(path.resolve(__dirname, './template/router.js'))

let firstLevel = ''
let secondLevel = ''

module.exports = async function(params = []) {
  const {length} = params
  if (length === 0) {
    firstLevel = await getAnswer('请填写一级路由: ')
    secondLevel = await getAnswer('请填写二级路由(可不填): ')
  } else if (length === 1) {
    firstLevel = params[0]
    secondLevel = await getAnswer('请填写二级路由(可不填): ')
  } else {
    firstLevel = params[0]
    secondLevel = params[1]
  }
  firstLevel = formatName(firstLevel)
  secondLevel = formatName(secondLevel)

  const firstLevelPath = path.resolve('src/views', firstLevel)
  // 确保一级、二级路由目录存在
  fs.ensureDirSync(path.resolve(firstLevelPath, 'sub-pages', secondLevel))

  // 确保一级路由的文件存在
  const firstLevelFile = path.resolve(firstLevelPath, `${formatComponentName(firstLevel)}.index.vue`)
  if (!fs.existsSync(firstLevelFile)) {
    fs.ensureFileSync(firstLevelFile)
    const firstLevelTemplate = vueTemplate.replace(/winsen-cli-component-name/g, firstLevel)
    fs.outputFileSync(firstLevelFile, firstLevelTemplate)
  }

  // 确保 components 文件夹存在
  fs.ensureDirSync(path.resolve(firstLevelPath, 'components'))

  // 添加store
  const storeFile = path.resolve(firstLevelPath, `store-router/store.js`)
  if (!fs.existsSync(storeFile)) {
    fs.ensureFileSync(storeFile)
    const newStoreTemplate = storeTemplate.replace(/___this_name_will_replace_again___/g, camelCase(firstLevel))
    fs.outputFileSync(storeFile, newStoreTemplate)
  }

  // 添加api模板
  const apiFile = path.resolve(firstLevelPath, `store-router/api.js`)
  if (!fs.existsSync(apiFile)) {
    fs.ensureFileSync(apiFile)
    fs.outputFileSync(apiFile, apiTemplate)
  }

  // 插入一级路由
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
  // 插入二级路由
  if (secondLevel) {
    const secondLevelRouteReg = new RegExp(`path:\\s*["']\\/?${secondLevel}["']`)
    if (!secondLevelRouteReg.test(routerFileStr)) {
      const replaceReg = new RegExp(`(children:\\s*)(\\[)`)
      const secondLevelRouteStr = secondLevelRoute
        .replace(/secondLevelComponentName/g, formatComponentName(secondLevel))
        .replace(/secondLevelName/g, camelCase(secondLevel))
        .replace(/secondLevel/g, secondLevel)
        .replace(/firstLevel/g, firstLevel)
        .replace(/firstLevelName/g, camelCase(firstLevel))
      routerFileStr = routerFileStr
        .replace(replaceReg, `$1$2${secondLevelRouteStr}`)
        .replace(/(,)(\n\s+])/g, '$2')
    }
  }
  fs.outputFileSync(routerFile, routerFileStr)


  // 确保二级路由的文件存在
  const secondLevelFile = path.resolve(firstLevelPath, 'sub-pages', secondLevel, `${formatComponentName(secondLevel)}.index.vue`)
  fs.ensureFileSync(secondLevelFile)
  const secondLevelTemplate = vueTemplate.replace(/winsen-cli-component-name/g, secondLevel)
  fs.outputFileSync(secondLevelFile, secondLevelTemplate)
}