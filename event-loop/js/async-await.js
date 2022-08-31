async function test() {
    try {
        const id = await getId()
        const name = await getName(id)
        console.log(name)
    } catch (e) {
        console.log('请求出错')
    }
}

function getName(id) {
    return new Promise((resolve) => setTimeout(() => {resolve('thankslyh')}, 2000))
}

function getId() {
    return new Promise((resolve) => setTimeout(() => {resolve('lyh')}, 2000))
}


async function fn1(){
    console.log(1)
    await pr1()
    await pr2()
    console.log(2)
}

function fn2(){
    console.log(3)
}

function pr1(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(4)
            resolve()
        }, 300)
    })
}

function pr2(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(5)
            resolve()
        }, 300)
    })
}

fn1()
fn2()
