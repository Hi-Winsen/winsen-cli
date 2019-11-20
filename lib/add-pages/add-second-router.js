const path = require('path')
const babelParser = require("@babel/parser")
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generator = require('babel-generator').default

// 二级路由配置模板
const {secondLevelRoute} = require(path.resolve(__dirname, '../template/router.js'))

const {
  camelCase,
  formatComponentName
} = require('../utils')

module.exports = function(options) {
  let {firstLevel, secondLevel, routerFileStr} = options

  // 将 router.js 文件内容转化为 AST
  const routerAst = babelParser.parse(routerFileStr, {
    sourceType: 'module',
    plugins: [
      'dynamicImport',
      'functionBind',
      'functionSent',
      'templateInvalidEscapes'
    ]
  })

  // 将二级路由的预定义名字替换为用户自定义的名字
  const secondLevelRouteStr = secondLevelRoute
    .replace(/secondLevelComponentName/g, formatComponentName(secondLevel))
    .replace(/secondLevelName/g, camelCase(secondLevel))
    .replace(/secondLevel/g, secondLevel)
    .replace(/firstLevelName/g, camelCase(firstLevel))
    .replace(/firstLevel/g, firstLevel)

  // 将二级路由配置模板转化为 AST
  const secondLevelRouteAst = babelParser.parse(secondLevelRouteStr, {
    sourceType: 'script',
    plugins: [
      'dynamicImport',
      'functionBind',
      'functionSent',
      'templateInvalidEscapes'
    ]
  })

  // 遍历 router.js 文件 AST，插入二级路由
  traverse(routerAst, {
    ExportDefaultDeclaration(path) {
      let arrayExpressionPath = []

      // router.js 文件导出的配置数组
      // 可能是 export default []
      // 也可能是 const xxx = []
      //         export default xxxx
      // 根据不同情况选择不同从插入方式
      if (path.get('declaration').isArrayExpression()) {
        // 导出的是一个数组

        // 查找出 children 属性的位置
        const propertyIndex = path
          .get('declaration')
          .get('elements.0')
          .node.properties
          .findIndex(objectProperty => t.isIdentifier(objectProperty.key, {name: 'children'}))
        
        // 将 arrayExpressionPath 定位到 children 所指向的数组
        if (propertyIndex !== -1) {
          arrayExpressionPath = path
            .get('declaration')
            .get('elements.0')
            .get(`properties.${propertyIndex}`)
            .get('value')
        }
      } else if (path.get('declaration').isIdentifier()) {
        // 导出的是一个引用

        // 提取引用名字
        const identifierName = path.get('declaration').node.name

        // 查找出该引用所定义的位置
        let variableDeclaratorIndex = -1
        const index = path.container.findIndex(node => {
          if (t.isVariableDeclaration(node) &&
            /var|let|const/.test(node.kind)
          ) {
            variableDeclaratorIndex = node.declarations.findIndex(variableDeclarator => {
              return t.isIdentifier(variableDeclarator.id, {name: identifierName})
            })
            return variableDeclaratorIndex !== -1
          }
        })

        // 定位该引用所指向的数组（也就是具体的 router 配置数组）
        const arrayExpression = path
          .getSibling(index)
          .get(`declarations.${variableDeclaratorIndex}`)
          .get('init')

        // 查找出 children 属性的位置
        const propertyIndex = arrayExpression
          .get('elements.0')
          .node.properties
          .findIndex(objectProperty => t.isIdentifier(objectProperty.key, {name: 'children'}))

        // 将 arrayExpressionPath 定位到 children 所指向的数组
        if (propertyIndex !== -1) {
          arrayExpressionPath = arrayExpression
            .get('elements.0')
            .get(`properties.${propertyIndex}`)
            .get('value')
        }
      }
      // 检查二级路由是否已注册
      const isRegister = arrayExpressionPath.node.elements.some(item => {
        return item.properties.findIndex(property => {
          return t.isStringLiteral(property.value, {value: `/${secondLevel}`}) ||
            t.isStringLiteral(property.value, {value: secondLevel})
        }) !== -1
      })

      // 如果未注册，用模板 AST 注册新的路由，如果已注册，放弃
      if (!isRegister) {
        arrayExpressionPath.node.elements.push(
          secondLevelRouteAst
            .program.body[0]
            .declarations[0]
            .init
        )
      }
    }
  })
  return generator(routerAst).code
}