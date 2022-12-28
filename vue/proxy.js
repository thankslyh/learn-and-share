const obj1 = {}

function defineProxy(property) {
    return new Proxy(property, {
        get(target, p, receiver) {
            console.log(`${p}被收集了`)
            return Reflect.get(target, p, receiver)
        },
        set(target, p, value, receiver) {
            console.log(`${p}发生了改变，要通知视图更新`)
            return Reflect.set(target, p, value, receiver)
        },
        deleteProperty(target, p) {
            console.log(`${p}被删除，要通知视图更新`)
            Reflect.deleteProperty(target, p)
        },
        has(target, p) {
            console.log(`${p}判断是否存在，需要收集`)
            return Reflect.has(target, p)
        }
    })
}
const target = defineProxy(obj1)

target.a = 2
delete target.a
console.log('a' in target)

const arr1 = []

const target1 = defineProxy(arr1)

target1.push(1)
target1[2] = 2
target1.includes(1)
