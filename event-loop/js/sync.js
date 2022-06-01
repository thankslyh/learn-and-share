const arr = ['同步', '数组', '调用']

function forEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        callback(array[i], i, array)
    }
}

const callback = (...args) => {
    console.log('同步回调执行', ...args)
}
forEach(arr, callback)
console.log('证明callback是在函数内部调用的')

