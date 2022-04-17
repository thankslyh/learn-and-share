## 什么是Tree Shaking

Tree Shaking又叫摇树机制，顾名思义就是通过摇树把枯萎的无用的树叶给摇下来。
在我们的代码中就是用过“摇”把无用的代码去掉，是优化的一个范畴

> 为什么学习Tree Shaking

1. 合理的运用tree shaking机制能够使我们代码打包时降低包的大小，优化加载速度
2. 最近几年的面试中`Tree Shaking`被问到的比较多，能够帮助我们面试

> 目标 (rollup)
1. 知道怎么合理的使用`Tree Shaking`
2. 了解`Tree Shaking`的核心原理(本次只是先了解一些基本概念)

> 为什么是rollup？
1. rollup是最早实现tree shaking的编译工具，并且我们的目标就是了解tree shaking
2. rollup在最早期0.20.0版本代码还相对较少，方便读

## DCE （Dead Code Elimination）死码清除
`DCE`和`Tree-shaking`的终极目标是一致的，就是为了减少无用的代码被打包，但它们存在区别

`rollup`的作者`Rich Haris`举了个蛋糕的例子：

指出 DCE 就好比在做蛋糕的时候直接把鸡蛋放入搅拌，最后在做好的蛋糕中取出蛋壳，这是不完美的做法，而 Tree-shaking 则是在做蛋糕的时候只放入我想要的东西，即不会把蛋壳放入搅拌制作蛋糕

[参考文章](https://segmentfault.com/a/1190000040476979)

> 什么是Dead Code

```javascript
// 声明了变量或函数却没有使用
const a = 1

// 引入了某个变量没有使用
import { a } from 'xxx'

// 导出的包里有纯函数调用
export const add => x => x + x

add(1)

// 永远都不会被执行的逻辑
if (false) {
  console.log('永远都不会到达的逻辑')
}
```
这一类没有被使用/不会被执行的代码就叫做死码，这一类代码不需要被打包进去，这个时候`webpack/rollup`就会使用摇树机制清除死码
## MagicString 类
```javascript
var magicString = new MagicString('export var name = "beijing"');
//类似于截取字符串
console.log(magicString.snip(0,6).toString()); // export

//从开始到结束删除字符串(索引永远是基于原始的字符串，而非改变后的)
console.log(magicString.remove(0,7).toString()); // var name = "beijing"

//很多模块，把它们打包在一个文件里，需要把很多文件的源代码合并在一起
let bundleString = new MagicString.Bundle();
bundleString.addSource({
    content:'var a = 1;',
    separator:'\n'
});
bundleString.addSource({
    content:'var b = 2;',
    separator:'\n'
});
/* let str = '';
str += 'var a = 1;\n'
str += 'var b = 2;\n'
console.log(str); */
console.log(bundleString.toString());
// var a = 1;
//var b = 2;
```
## AST 抽象语法树
把`js`代码转换为`ast`语法树，方便操作树，一般webpack和rollup都是用acorn去解析ast语法书
```json
// import { cube } from 'math'
{
  "type": "Program",
  "start": 0,
  "end": 27,
  "body": [
    {
      "type": "ImportDeclaration",
      "start": 0,
      "end": 27,
      "specifiers": [
        {
          "type": "ImportSpecifier",
          "start": 9,
          "end": 13,
          "imported": {
            "type": "Identifier",
            "start": 9,
            "end": 13,
            "name": "cube"
          },
          "local": {
            "type": "Identifier",
            "start": 9,
            "end": 13,
            "name": "cube"
          }
        }
      ],
      "source": {
        "type": "Literal",
        "start": 21,
        "end": 27,
        "value": "math",
        "raw": "'math'"
      }
    }
  ],
  "sourceType": "module"
}
```
ast在线转换 [https://astexplorer.net/](https://astexplorer.net/)

1. ast语法树解析，每个文件是一个`Program`
2. body里存放的所有完整的语句`var a = 1;`

> export语句
```json
// export const a = (x) => x * x;
{
  "type": "ExportNamedDeclaration",
  "start": 45,
  "end": 75,
  "declaration": {
    "type": "VariableDeclaration",
    "start": 52,
    "end": 75,
    "declarations": [
      {
        "type": "VariableDeclarator",
        "start": 58,
        "end": 74,
        "id": {
          "type": "Identifier",
          "start": 58,
          "end": 59,
          "name": "a"
        },
        "init": {
          "type": "ArrowFunctionExpression",
          "start": 62,
          "end": 74,
          "id": null,
          "expression": true,
          "generator": false,
          "async": false,
          "params": [
            {
              "type": "Identifier",
              "start": 63,
              "end": 64,
              "name": "x"
            }
          ],
          "body": {
            "type": "BinaryExpression",
            "start": 69,
            "end": 74,
            "left": {
              "type": "Identifier",
              "start": 69,
              "end": 70,
              "name": "x"
            },
            "operator": "*",
            "right": {
              "type": "Identifier",
              "start": 73,
              "end": 74,
              "name": "x"
            }
          }
        }
      }
    ],
    "kind": "const"
  },
  "specifiers": [],
  "source": null
}
```
`export`语句是有`declaration`声明的，里面存放导出的属性声明

...

## walk 递归遍历ast语法树
```javascript
// walk函数
function visit (node, parent, enter, leave, prop, index) {
	if (!node) return;

	if (enter) {
		context.shouldSkip = false;
		enter.call(context, node, parent, prop, index);
		if (context.shouldSkip) return;
	}
  // {}
	var keys = (childKeys[node.type] = Object.keys(node).filter(function (key) {
		return typeof node[key] === 'object';
	}));

	var key, value, i, j;

	i = keys.length;
  // 从后往前遍历key
	while (i--) {
		key = keys[i];
		value = node[key];
    // 如果该属性的value是数组，就从后往前遍历该数组
		if (isArray(value)) {
			j = value.length;
			while (j--) {
				visit(value[j], node, enter, leave, key, j);
			}
		} else if (value && value.type) {
			visit(value, node, enter, leave, key, null);
		}
	}

	if (leave) {
		leave(node, parent, prop, index);
	}
}
function walk (ast, ref) {
	var enter = ref.enter;
	var leave = ref.leave;

	visit(ast, null, enter, leave);
}
```

`rollup`遍历遍历语句/词法是从后往前递归遍历

## Tree Shaking原理
1. ES6的模块引入是静态分析的，故而可以在编译时正确判断到底加载了什么代码
2. 分析程序流，判断哪些变量未被使用、引用，进而删除此代码。

> 为什么是静态分析？为什么是es6而不是commonjs（抛开import()），import为什么必须在顶部

```javascript
if (isLoad) {
  import a from 'b' // 报错
}
```

首先import不知吃在条件语句里引入的（import(xxx)不算），因为esModule语法在经过`ast`编译的时候是静态的，也就是说在编译的时候没有办法知道`isLoad`是否为true，`commonjs`的`require`是可以在条件语句内加载的，固不支持`tree shaking`

> 怎么删dead code？在哪删？

1. `rollup`在build的时候会给当前应用创建一个`bundle`对象，上面包含了所有的`module`
2. 加在其对应的`module`,每一个文件是一个`module`，每一个module会把里面的source code创建一个magicString，方便操作
3. 接待来module会进行ast转码，把body里的语法创建为statement的实例对象
4. statement代码walk分析
  - 如果是子面量`Literal`直接放入`stringLiteralRanges`二维数组，标记其位置 [[0, 2]]
  - 如果子节点是一个`Identifier`,父节点与子节点存在引用，则把当前node创建一个Refrence的实例，放入当前节点的引用数组中，目的是为了遍历这个statement的时候能勾知道引用了其他的数据
5. 标记模块副作用。`module.markAllSideEffect -> statement.markSideEffect -> state.refrences.declaration.use`
  - 如果该语句是`Function`类型，并且不是iife，直接忽略，没有副作用
  - 如果该语句是`CallExpress | NewExpression`必然会存在副作用，打上标记，并去遍历它所有的引用打上标记
  - xxx
6. 调用bundle.render，输出所有有副作用的`module`(module.toString())

参考文档

[https://zhuanlan.zhihu.com/p/32831172](https://zhuanlan.zhihu.com/p/32831172)
[https://segmentfault.com/a/1190000040009496](https://segmentfault.com/a/1190000040009496)
[https://segmentfault.com/a/1190000040476979](https://segmentfault.com/a/1190000040476979)

## 其他

webpack4、5生产环境现在都支持了tree shaking，[副作用](https://zhuanlan.zhihu.com/p/32831172)几乎也没有，但是webpack现在代码量庞大，498 份JS文件 18862 行注释 73548 行代码，好处是在于生态圈庞大

rollup比较轻量级，适合开发一些小插件之类的库