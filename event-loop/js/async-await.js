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
