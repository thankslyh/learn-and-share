function test() {
    setTimeout(function () {
        console.log('异步回调任务')
    }, 2000)
    console.log('证明异步是在函数外被调用的')
}
test()
