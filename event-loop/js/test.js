function test1() {
    Promise.resolve(1).then(res => console.log(res))
    test2()
}

function test2() {
    test3()
}

function test3() {
    setTimeout(() => {
        console.log('timeout')
    }, 2000)
    console.log('test3')
}

test1()
