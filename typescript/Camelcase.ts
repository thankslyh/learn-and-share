/**
     type Obj1 = {
        aa: string;
        aa_bb: string;
        aaCc: string;
        aa_Dd: {
            aa_ee: string;
        };
        aaFf: ['zzz_ccc', 'xxx_vvv']
    }

    type Obj2 = {
        aa: string;
        aaBb: string;
        aaCc: string;
        aaDd: {
            aaEe: string;
        };
        aaFf: ['zzzCcc', 'xxxVvv']
    }
    实现一个Camecase类型完成转换
 */

type Turn<T> = T extends any ? {
    [Key in keyof T as Camelcase<Key & string>]:
    T[Key] extends Array<infer Ele extends string>
    ? Camelcase<Ele>
    : T[Key] extends Record<string, any>
        ? Turn<T[Key]>
        : T[Key]
} : never

type Camelcase<Str extends string> =
    Str extends `${infer Left}_${infer Right}`
    ? `${Left}${Capitalize<Camelcase<Right>>}`
    : Str

type res = Turn<{
    aa: string;
    aa_bb: string;
    aaCc: string;
    Aa_Dd: {
        aa_ee: string;
    };
    aaFf: ['zzz_ccc', 'xxx_vvv']
}>
