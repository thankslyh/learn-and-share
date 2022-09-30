// 递归获取promise value
type GetPromiseValue2<F> = 
  F extends Promise<infer Val>
    ? Val extends Promise<infer Val>
      ? GetPromiseValue2<Val>
      : Val
    : any

type resxxx = GetPromiseValue2<Promise<Promise<'12'>>>

// 数组push
type Push<A extends unknown[], Ele> = [...A, Ele]

type pushRes = Push<[1, 2, 3], 4>

// 数组unshift
type Unshift<A extends unknown[], Ele> = [Ele, ...A]

type unshiftRes = Unshift<[1, 2, 3], 0>

// 合并元组
type Zip<F extends unknown[], S extends unknown[]> = 
  F extends [infer TFirst, ...infer TRest]
  ? S extends [infer SFirst, ...infer SRest]
    ? [[TFirst, SFirst], ...Zip<TRest, SRest>]
    : []
  : []

type zipRes = Zip<['1', '2', '3'], ['A', 'B', 'C']>

// 首字母大写
type CapitalizeStr<S> = S extends `${infer F}${infer Last}` ? `${Uppercase<F>}${Last}` : S;

type capitalizeRes = CapitalizeStr<'thankslyh'>

// 全部大写
type CapitalizeStr2<S> = S extends `${infer F}${infer Rest}` ? `${Uppercase<F>}${CapitalizeStr2<Rest>}` : S;

type capitalize2Res = CapitalizeStr2<'thankslyh'>

// 驼峰
type ToCamelcase<Str> = Str extends `${infer Left}_${infer Rest}${infer Right}`
  ? `${Left}${CapitalizeStr<Rest>}${ToCamelcase<Right>}`
  : Str

type camelcaseStr = ToCamelcase<'aaa_bbb_ccc'>

// 删除字符
type DropSubStr<Str extends string, SubStr extends string> = 
  Str extends `${infer Prefix}${SubStr}${infer Suffix}`
  ? DropSubStr<`${Prefix}${Suffix}`, SubStr>
  : Str

type dropStr = DropSubStr<'hhahahahhaha', 'hah'>

// 重新构造参数
type AppendArguments<F extends Function, Arg> = 
  F extends (...args: infer Args) => infer RType
    ? (...args: [...Args, Arg]) => RType
    : never

type appendArgumentsRes = AppendArguments<(a: string, b: string) => string, {a: string}>

// Readonly
type obj = {
  name: string;
  age: number;
  gender: boolean;
}

type ToReadonly<Obj> = {
  readonly [Key in keyof Obj]: Obj[Key]
}

type objRes = ToReadonly<obj>

// Mapping
type Mapping<T extends object> = {
  [Key in keyof T]: [T[Key], T[Key], T[Key]]
}

type mappingRes = Mapping<{a: string}>

// toPartial
type ToPartial<Obj extends object> = {
  [Key in keyof Obj]-?: Obj[Key]
}

type toPartialRes = ToPartial<
  {
    a: string;
    b?: number;
  }
>
