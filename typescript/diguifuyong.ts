// 递归复用
type DeepPromiseValue<F> = 
  F extends Promise<infer Val>
    ? DeepPromiseValue<Val>
    : F

type dpRes = DeepPromiseValue<Promise<Promise<'123'>>>

// reverse
type Reverse<Arr> = 
  Arr extends [infer First, ...infer Rest]
    ? [...Reverse<Rest>, First]
    : Arr

type reverseRes = Reverse<[1, 2, 3, 4]>

type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)

// Includes
type Includes<Arr extends unknown[], FindItem> = 
  Arr extends [infer First, ...infer Rest extends unknown[]]
    ? IsEqual<First, FindItem> extends true
      ? true
      : Includes<Rest, FindItem>
    : false

type findRes = Includes<[1, 2, 3, 4, 5], 6>

// RemoveItem
type RemoveItem<Arr extends unknown[], Item> =
  Arr extends [infer First, ...infer Rest]
    ? IsEqual<First, Item> extends true
      ? Rest
      : Rest extends []
        ? RemoveItem<Rest, Item>
        : Arr
    : Arr

type removeItemRes = RemoveItem<[1, 2, 3, 4, 5], 0>

// BuildArr
type BuildArr<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr['length'] extends Length
  ? Arr
  : BuildArr<Length, Ele, [...Arr, Ele]>

type buildArrRes = BuildArr<10, number, [string]>

// string转union
type StringToUnion<Str extends string> = 
  Str extends `${infer Left}${infer Rest}`
    ? Left | StringToUnion<Rest>
    : never

type stringToUnionRes = StringToUnion<'1233333337'>

// 所有组合
type Combination<A extends string, B extends string> = A | B | `${A}${B}` | `${B}${A}`;

type com1 = Combination<'h', 'a'>

type AllCombinations<A extends string, B extends string = A> = 
  A extends A 
    ? Combination<A, AllCombinations<Exclude<B, A>>>
    : never

type com2 = AllCombinations<'a' | 'b' | 'c'>

// bem
type BEM<
  B extends string,
  E extends string[],
  M extends string[]
> = `${B}__${E[number]}--${M[number]}`

type bemRes = BEM<'header', ['div', 'h1'], ['success', 'error']>