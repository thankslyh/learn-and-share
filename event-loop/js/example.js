// function foo(){
//     foo()
// }
// foo()

let count = 2000000000
// 异步任务会被主线程任务阻塞的例子
function foo(){
    count += 1
    const startTimeStamp = Date.now()
    setTimeout(function () {
        console.log('foo 执行', Date.now() - startTimeStamp)
        foo()
    }, 0)
    let i = 0
    while (i < count) {
        i++
    }
}

foo()

// 有return，正常
// async function testAsync() {
//     return 1
// }
//
// const testAsyncResult = testAsync()
// console.log(testAsyncResult)

// 抛出错误
// async function testAsync() {
//     return Promise.reject(new Error('错误信息'))
// }
//
// const testAsyncResult = testAsync()
// testAsyncResult.then(res => console.log(res)).catch(err => console.log(err))

// async function run() {
//     const data = await test()
//     console.log(data)
// }
//
// function test() {
//     return 1
// }
//
// run()

// 代码阻塞
// async function run() {
//     const data = await test()
//     console.log(data)
//     const test2 = '测试'
//     console.log(test2)
// }
//
// function test() {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve('test')
//         }, 3000)
//     })
// }
//
// run()
