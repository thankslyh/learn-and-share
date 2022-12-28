// 即解析url参数
// a=b&c=d&e=f
type MappingParam<Str extends string> = 
  Str extends `${infer Key}=${infer Val}`
    ? {
      [k in Key]: Val
    }
    : {}

type mapStr1 = MappingParam<'a=1'>

type MergeParam<Obj1 extends object, Obj2 extends object> = Obj1 & Obj2

type merge1 = MergeParam<{a: 1, b: 2}, {c: 3}>
type ParseQuery<Str extends string> =
  Str extends `${infer Param}&${infer Rest}`
    ? MergeParam<MappingParam<Param>, ParseQuery<Rest>>
    : MappingParam<Str>

type query1 = ParseQuery<'a=1&b=2&c=3'>

const obj11 = {
  getC: 1,
  getB: 2
}

type ValueOf<T> = T[keyof T]
type res11 = ValueOf<keyof typeof obj11>