// 小明打算起床10分钟后出门去上班，但是他还打算中间去洗个澡
function getUp() {
    console.log('起床')
}

getUp()

setTimeout(() => {
    console.log('出门上班去')
}, 2000)

setTimeout(() => {
    let i = 0
    const start = Date.now()
    console.log('洗澡中...')
    while (i <= 4000000000) {
        i++
    }
    console.log('洗澡中结束', Date.now() - start)
}, 0)
