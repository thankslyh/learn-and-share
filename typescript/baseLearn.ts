// 类型key全部变为非必选
type Partial1<Obj> = {
  [K in keyof Obj]?: Obj[K]
}

type res1 = Partial1<{
  aa: string;
}>

type Record1<K extends keyof any, V> = {
  [P in K]: V
}

type res2 = Record<string, Array<string>>

type Require1<Obj> = {
  [K in keyof Obj]-?: Obj[K]
}

type res3 = Require1<res1>

type Pick1<Obj extends Record1<string, any>, K> = K extends keyof Obj ? K : never

type res4 = Pick1<{
  aaa: string;
  bbb: string;
  ddd: string;
}, 'aaa' | 'bbb'>

type Omit1<Obj extends Record1<string, any>, K> = K extends keyof Obj ? never : K

type res5 = Omit<{
  aaa: string;
  bbb: string;
  ddd: string;
}, 'aaa'>

type ReturnType1<F> = F extends (...args: any[]) => infer R ? R : never

type res6 = ReturnType1<(x: number) => string>

type Parameter1<F> = F extends (...args: infer A) => any ? A : never

type res7 = Parameter1<(x: number, y: string) => string>