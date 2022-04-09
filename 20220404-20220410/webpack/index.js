import todo, { b } from './todo'
import test from './umd.js'
import common, { name } from './common.js'

todo(b)

console.log(test)
console.log(common)
console.log(name)

export default {
  name: '这是根模块'
}