function defineProperty(obj) {
  const keys = Object.keys(obj)
  keys.forEach(k => {
    Object.defineProperty(obj, k, {
      get(val) {
        console.log(`${k}被收集了`)
        return val
      },
      set() {
        console.log(`${k}发生了改变，要通知视图更新`)
      }
    })
  })
}

// 数组监听
function defineArray(arr) {
  arr.forEach((v, idx) => {
    Object.defineProperty(arr, idx, {
      get() {
        console.log(`下标${idx}被收集了`)
        return v
      },
      set() {
        console.log(`下标${idx}发生了改变，要通知视图更新`)
      }
    })
  })
}

function enhancePush() {
  const rowPush = Array.prototype.push
  Array.prototype.push = function (...args) {
    rowPush.call(this, ...args)
    // 更新视图操作
    console.log('数据发生了改变，进行试图更新')
    return this.length
  }
}

// 正常
const obj1 = {
  a: 1
}
defineProperty(obj1)
// obj1.a
//
// obj1.a = 2

console.log('a' in obj1)

const obj2 = {}


defineProperty(obj2)

obj2.a
obj2.a = 1

// 数组情况
const arr1 = [1, 2, 3, 4]

defineArray(arr1)
arr1[0]
arr1[0] = 10
