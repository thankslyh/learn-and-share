const obj = {
    a: {
        b: 1
    },
    c: {
        e: 2
    }
}

function dfsObj(obj) {
    if (typeof obj === 'object') {
        for (let i in obj) {
            dfsObj(obj[i])
        }
    }
    console.log(obj)
}


function bfsObj(obj) {
    const queue = []
    queue.unshift(obj)
    while (queue.length) {
        const cur = queue.pop()
        console.log(cur)
        if (typeof cur === 'object') {
            for (let i in cur) {
                queue.unshift(cur[i])
            }
        }
    }
    console.log('bfs end.............\n\n\n\n')
}
bfsObj(obj)
dfsObj(obj)
