// 获取promise value
type GetPromiseValue<P> = P extends Promise<infer Val> ? Val : never

type promiseVal = GetPromiseValue<Promise<'123'>>

// 提取数组第一个元素
type GetArrayFirstEle<A> = A extends [infer First, ...unknown[]] ? First : never

type firstVal = GetArrayFirstEle<[1, 2, 3]>

//提取数组最后一个元素
type GetArrayLastEle<A> = A extends [...unknown[], infer Last] ? Last : never

type lastVal = GetArrayLastEle<[1, 2, 3]>

/**
 * any和never的区别
 * any和never都代表任意类型，unknown只能接受任意类型的值，而any除此之外也可以赋值给任意类型的值
 * example：如下
 */
// type a = any
// let aVal: a = 1

// type b = never
// let bVal: b = 1

// 获取数组的剩余元素
type GetArrayRestVal<A> = A extends [any, ...infer Rest] ? Rest : never

type restVal = GetArrayRestVal<[1, 2, 3]>

// 获取数组前几个元素（不包含第一个）
type GetArrayRest2Val<A> = A extends [...infer Rest, any] ? Rest : never

type restVal2 = GetArrayRest2Val<[1, 2, 3]>

// 匹配某个字符开头的字符串
type StartWith<Str extends string, Prefix extends string> = Str extends `${Prefix}${string}` ? true : false

type startWithRes = StartWith<'23333', '2'>

// 替换字符
type Replace<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : never;

type replaceRes = Replace<'hello world ?', '?', 'hahaha'>

// 去除空格
type Trim<
  Str extends string
> = Str extends `${' ' | '\n' | '\t'}${infer Rest}${' ' | '\n' | '\t'}`
  ? Trim<Rest>
  : Str;

type trimVal = Trim<'     aaa bbb ccc 1     '>

// 获取this类型
type GetThisType<T> = T extends (this: infer ThisType, ...args: any[]) => any ? ThisType : never;

class Test {
  do(this: Test) {

  }
}

const t = new Test()

type thisRes = GetThisType<typeof t.do>

// 获取构造器
type GetConstructType<T> = T extends new (...args: any[]) => infer Con ? Con : never

interface Person {
  name: string;
}

interface PersonConstruct {
  new (name: string): Person
}

type constructRes = GetConstructType<PersonConstruct>

// 获取构造器parameters
type GetConstructParametes<T> = T extends new (...args: infer P) => any ? P : never

type constructParametes = GetConstructParametes<PersonConstruct>

// 获取索引类型
type GetRef<T> = 'ref' extends keyof T
  ? T extends { ref?: infer Val | undefined }
    ? Val
    : never
  : never

type refRes = GetRef<{ ref: 1 }>
type refRes2 = GetRef<{ref: undefined, name: 2 }>

