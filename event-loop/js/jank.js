function render() {
    let i = 0
    console.log('render')
    while (i <= 4000000000) {
        i++
    }
    console.log('render over')
}
function doSomething() {
    console.log('doSomething')
}
document.getElementById('button').onclick = () => {
    render()
    doSomething()
}

