/**
 * 格式化命名，去掉不符合规则的字符（如/-*-￥%&），字母开头，字母/数字结尾
 */
exports.formatName = function(str) {
  return str
    .trim()
    .replace(/[^\w-]/, '')
    .replace(/^[^a-zA-Z]*([\w-]+?)[^a-zA-Z0-9]*$/, '$1')
}

/**
 * 驼峰命名
 */
exports.camelCase = function(str) {
  return exports.formatName(str)
    .replace(/(-(\w))/, (match, $1, $2) => {
      return $2.toUpperCase()
    })
}

/**
 * 首字母大写，给组件命名
 */
exports.formatComponentName = function(str) {
  return exports.camelCase(str)
    .replace(/^(\w)(\w*)/, (match, $1, $2) => {
      return $1.toUpperCase() + $2
    })
}