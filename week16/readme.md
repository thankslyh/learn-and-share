## 什么是Tree Shaking

Tree Shaking又叫摇树机制，顾名思义就是通过摇树把枯萎的无用的树叶给摇下来。
在我们的代码中就是通过“摇”把无用的代码去掉，是优化的一个范畴

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
-------------------
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

接下来我们先了解一些`rollup`中基本库
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
把`js`代码转换为`ast`语法树，方便操作树，一般webpack和rollup都是用acorn去解析ast语法树
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

`rollup`遍历遍历语句/词法是从后往前递归遍历，也就是会先遍历后面的语句和词法

## Tree Shaking原理
1. ES6的模块引入是静态分析的，故而可以在编译时正确判断到底加载了什么代码
2. 分析程序流，判断哪些变量未被使用、引用，进而删除此代码。

> 为什么是静态分析？为什么是es6而不是commonjs（抛开import()），import为什么必须在顶部

```javascript
if (isLoad) {
  import a from 'b' // 报错
}
```

首先import不支持在条件语句里引入的（import(xxx)不算），因为esModule语法在经过`ast`编译的时候是静态的，也就是说在编译的时候没有办法知道`isLoad`是否为true，`commonjs`的`require`是可以在条件语句内加载的，固不支持`tree shaking`

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

> 新增

我们先找到`rollup`入口文件
```javascript
export function rollup ( options ) {
    // 创建bundle，每一个入口是一个bundle
    const bundle = new Bundle( options );
    // 执行build方法
    return bundle.build()
}
```

接下来我们逐步去分析`Bundle`这个类
## Bundle

```javascript
export default class Bundle {
	constructor ( options ) {
		this.entry = options.entry;
		// 保存entryModule也就是entry对应的文件生成的module
		this.entryModule = null;

		this.plugins = ensureArray( options.plugins );
		// 根据路径找到文件的方法
		this.resolveId = first(
			this.plugins
				.map( plugin => plugin.resolveId )
				.filter( Boolean )
				.concat( resolveId )
		);
		// 根据文件路径找读取文件内容
		this.load = first(
			this.plugins
				.map( plugin => plugin.load )
				.filter( Boolean )
				.concat( load )
		);
		// 允许用户定制化一些转换代码规则
		this.transformers = this.plugins
			.map( plugin => plugin.transform )
			.filter( Boolean );
        // 正在创建中的一些模块，避免循环
		this.pending = blank();
		// 通过id获取module
		this.moduleById = blank();
		// 存放所有的module
		this.modules = [];
	}
    // 打包
	build () {
		return Promise.resolve( this.resolveId( this.entry, undefined ) ) // 根据入口用过获取到source code`import {a} from 'b'`
			.then( id => this.fetchModule( id, undefined ) )
            // 入口文件对应的module
			.then( entryModule => {
				//...
			});
	}

	deconflict () {...}

	fetchModule ( id, importer ) {
		// short-circuit cycles
		// 如果该模块正在记载直接返回，目的是为了避免循环
		if ( this.pending[ id ] ) return null;
		this.pending[ id ] = true;
		// 读取源代码 source code
		return Promise.resolve( this.load( id ) )
			// 先经过使用者自定义的转换器进行一次转换
			.then( source => transform( source, id, this.transformers ) )
			.then( source => {
				const { code, originalCode, ast, sourceMapChain } = source;
                // 创建入口文件的module
				const module = new Module({ id, code, originalCode, ast, sourceMapChain, bundle: this });

				this.modules.push( module );
				this.moduleById[ id ] = module;

				return this.fetchAllDependencies( module ).then( () => module );
			});
	}
    // 获取module所依赖的所有module
    // 也就是该模块 `import xxx from 'xxx'`引入的内容
	fetchAllDependencies ( module ) {...}
    // 输出处理后的source code
	render ( options = {} ) {...}

	sort () {...}
}
```
经过上面`Bundle`文件我们可以大概了解`bundle`做了哪些事情
1. 创建`bundle并`调用 `build`方法，得到`entryModule`
2. 根据入口文件名称调用`fetchModule`方法获取到文件的 `source code`
3. 调用用户自定义传入的 `transfrom`方法转换`source code`,如果没传则不处理
4. 把创建出来的 `module`放入自身的`this.modules`和`this.moduleById`里，方便之后使用
5. 加载当前 `module`所依赖的全部依赖

还有其他的一些方法，由于现在还没有流转到，所以这里先不说。那我们接下来去看这个 `Module`类做了什么

## Module
```javascript
export default class Module {
	constructor ({ id, code, originalCode, ast, sourceMapChain, bundle }) {
		// 当前被用户转换后的代码
		this.code = code;
		// 源码，也就是直接被读取到的字符串
		this.originalCode = originalCode;
		this.sourceMapChain = sourceMapChain;
		// 保存父bundle，也就是把module对应上父bundle,方便直接使用
		this.bundle = bundle;
		this.id = id;

		// 该module所依赖的所有属性/方法
		this.dependencies = [];
		this.resolvedIds = blank();

		// 该模块引用的依赖 `import a from 'b'`
		this.imports = blank();
		// 该模块导出的依赖 `export const foo = 1`
		this.exports = blank();
		// 该模块从其他模块导出的依赖 `export foo from 'b'`
		this.reexports = blank();
		// 给该文件创建magicString，方便进行删除、新增等操作
		this.magicString = new MagicString( code, {
			filename: id,
			indentExclusionRanges: []
		});

		// 解析语法树转换为表达式
		this.statements = this.parse( ast );
		// 该模块所有的声明
		this.declarations = blank();
		// 分析模块
		this.analyse();
	}
	// 当前语句是导出语句，就把该语句添加到dependencies和exports里reexports
	addExport ( statement ) {...}
	// 当前语句是导入语句，就把该语句添加到dependencies和imports里
	addImport ( statement ) {...}
	// 模块分析方法
	analyse () {
		// discover this module's imports and exports
		this.statements.forEach( statement => {
			// 是import/export表达式，就分别把该表达式放入对应的数组中
      // 目的是为了标记模块依赖的模块位置
      // 也就是说index 模块引用的cube对应的文件名
			// math模块导出的变量对应的位置
			if ( statement.isImportDeclaration ) this.addImport( statement );
			else if ( statement.isExportDeclaration ) this.addExport( statement );
			// 分析语句
			statement.analyse();

			statement.scope.eachDeclaration( ( name, declaration ) => {
				this.declarations[ name ] = declaration;
			});
		});
	}

	basename () {}
	// 绑定别名
	bindAliases () {...}

	bindImportSpecifiers () {
		[ this.imports, this.reexports ].forEach( specifiers => {
			keys( specifiers ).forEach( name => {
				const specifier = specifiers[ name ];

				const id = this.resolvedIds[ specifier.source ];
				specifier.module = this.bundle.moduleById[ id ];
			});
		});

		this.exportAllModules = this.exportAllSources.map( source => {
			const id = this.resolvedIds[ source ];
			return this.bundle.moduleById[ id ];
		});
	}
	// 绑定引用，也就是该模块依赖于其他模块的变量/方法
	bindReferences () {...}

	consolidateDependencies () {
		let strongDependencies = blank();
		let weakDependencies = blank();

		// treat all imports as weak dependencies
		this.dependencies.forEach( source => {
			const id = this.resolvedIds[ source ];
			const dependency = this.bundle.moduleById[ id ];

			if ( !dependency.isExternal ) {
				weakDependencies[ dependency.id ] = dependency;
			}
		});

		// identify strong dependencies to break ties in case of cycles
		this.statements.forEach( statement => {
			statement.references.forEach( reference => {
				const declaration = reference.declaration;

				if ( declaration && declaration.statement ) {
					const module = declaration.statement.module;
					if ( module === this ) return;

					// TODO disregard function declarations
					if ( reference.isImmediatelyUsed ) {
						strongDependencies[ module.id ] = module;
					}
				}
			});
		});

		return { strongDependencies, weakDependencies };
	}

	getExports () {
		let exports = blank();

		keys( this.exports ).forEach( name => {
			exports[ name ] = true;
		});

		keys( this.reexports ).forEach( name => {
			exports[ name ] = true;
		});

		this.exportAllModules.forEach( module => {
			module.getExports().forEach( name => {
				if ( name !== 'default' ) exports[ name ] = true;
			});
		});

		return keys( exports );
	}
	// 标记副作用
	markAllSideEffects () {
		let hasSideEffect = false;

		this.statements.forEach( statement => {
			if ( statement.markSideEffect() ) hasSideEffect = true;
		});

		return hasSideEffect;
	}

	namespace () {...}

	parse ( ast ) {
		// The ast can be supplied programmatically (but usually won't be)
		// 允许提供ast（但通常不会）
		if ( !ast ) {
			// Try to extract a list of top-level statements/declarations. If
			// the parse fails, attach file info and abort
			try {
				ast = parse( this.code, {
					ecmaVersion: 6,
					sourceType: 'module',
					onComment: ( block, text, start, end ) => this.comments.push({ block, text, start, end }),
					preserveParens: true
				});
			} catch ( err ) {
				err.code = 'PARSE_ERROR';
				err.file = this.id; // see above - not necessarily true, but true enough
				err.message += ` in ${this.id}`;
				throw err;
			}
		}

		walk( ast, {
			enter: node => {
				// 給开始和结束的地方打上标记
				this.magicString.addSourcemapLocation( node.start );
				this.magicString.addSourcemapLocation( node.end );
			}
		});

		let statements = [];
		let lastChar = 0;
		let commentIndex = 0;

		ast.body.forEach( node => {
			if ( node.type === 'EmptyStatement' ) return;
			// 这里的主要作用是把 export let a1, a2;中这种批量export声明处理成一个ExportNamedDeclaration
			// 同时执行下面的代码第二个if时分割成多个VariableDeclaration声明
			if (
				node.type === 'ExportNamedDeclaration' &&
				node.declaration &&
				node.declaration.type === 'VariableDeclaration' &&
				node.declaration.declarations &&
				node.declaration.declarations.length > 1
			) {
				// push a synthetic export declaration
				// 就把该声明放入一个自己合成的Node里
				const syntheticNode = {
					type: 'ExportNamedDeclaration',
					specifiers: node.declaration.declarations.map( declarator => {
						const id = { name: declarator.id.name };
						return {
							local: id,
							exported: id
						};
					}),
					isSynthetic: true
				};

				const statement = new Statement( syntheticNode, this, node.start, node.start );
				statements.push( statement );
				// 删除source code中的export ，已经不需要了
				this.magicString.remove( node.start, node.declaration.start );
				node = node.declaration;
			}

			// special case - top-level var declarations with multiple declarators
			// should be split up. Otherwise, we may end up including code we
			// don't need, just because an unwanted declarator is included
			// 顶层的var a, b, c;
			// 或者export a, b, c;到这里给处理成多个VariableDeclaration语句
			if ( node.type === 'VariableDeclaration' && node.declarations.length > 1 ) {
				// remove the leading var/let/const... UNLESS the previous node
				// was also a synthetic node, in which case it'll get removed anyway
				const lastStatement = statements[ statements.length - 1 ];
				if ( !lastStatement || !lastStatement.node.isSynthetic ) {
					this.magicString.remove( node.start, node.declarations[0].start );
				}

				node.declarations.forEach( declarator => {
					const { start, end } = declarator;

					const syntheticNode = {
						type: 'VariableDeclaration',
						kind: node.kind,
						start,
						end,
						declarations: [ declarator ],
						isSynthetic: true
					};

					const statement = new Statement( syntheticNode, this, start, end );
					statements.push( statement );
				});

				lastChar = node.end; // TODO account for trailing line comment
			}

			else {
				let comment;
				do {
					comment = this.comments[ commentIndex ];
					if ( !comment ) break;
					if ( comment.start > node.start ) break;
					commentIndex += 1;
				} while ( comment.end < lastChar );

				const start = comment ? Math.min( comment.start, node.start ) : node.start;
				const end = node.end; // TODO account for trailing line comment
				// 这里就是正常的export导出
				// 处理成Statement 创建一个表达式
				const statement = new Statement( node, this, start, end );
				statements.push( statement );

				lastChar = end;
			}
		});

		let i = statements.length;
		let next = this.code.length;
		while ( i-- ) {
			// 设置后一个的语句的next位置为上一个的开始位置，方便删除，直接从该语句的start到next（指向的是下个语句的start）
			// 能够精准删除该语句包括两个语句之间的符号（换行符、注释等等）
			// 删除时只需要 this.magicString.remove(statement.start, statement.next)
			statements[i].next = next;
			// 合成语句在magicString的source code中不存在，所以不需要设置
			if ( !statements[i].isSynthetic ) next = statements[i].start;
		}

		return statements;
	}
	// 输出该模块的source code字符串
	render ( es6 ) {...}
	// 根据所依赖的引用的名字，查找该声明
	trace ( name ) {
		if ( name in this.declarations ) return this.declarations[ name ];
		if ( name in this.imports ) {
			const importDeclaration = this.imports[ name ];
			const otherModule = importDeclaration.module;

			if ( importDeclaration.name === '*' && !otherModule.isExternal ) {
				return otherModule.namespace();
			}

			return otherModule.traceExport( importDeclaration.name, this );
		}

		return null;
	}
	// 根据引用里的名字，获取到导出的属性/方法
	traceExport ( name, importer ) {
		// export { foo } from './other'
		const reexportDeclaration = this.reexports[ name ];
		if ( reexportDeclaration ) {
			return reexportDeclaration.module.traceExport( reexportDeclaration.localName, this );
		}

		const exportDeclaration = this.exports[ name ];
		if ( exportDeclaration ) {
			return this.trace( exportDeclaration.localName );
		}

		for ( let i = 0; i < this.exportAllModules.length; i += 1 ) {
			const module = this.exportAllModules[i];
			const declaration = module.traceExport( name, this );

			if ( declaration ) return declaration;
		}

		let errorMessage = `Module ${this.id} does not export ${name}`;
		if ( importer ) errorMessage += ` (imported by ${importer.id})`;

		throw new Error( errorMessage );
	}
}
```

上面是`Module`类的`build`流程中主要做的事情

1. 创建类的同时保存一些必要属性`imports/exports/dependencies/bundle/statements`,创建`magicString`实例方便操作字符串等等
2. 解析该`module`的`source code`为ast语法树，目的是为了处理里面的语句
	- 空语句不用解析`EmptyStatement`
	- `export var a1, a2, a3`这样的多声明的`exportNamedDeclaration`语句，就把它组合成正常带标识符的语句，
	同时把当前正在解析的node改变为声明数组，也就是这一步`node = node.declaration;`，其目的是为了在下面的if执
	行的时候把多变量声明拆分为单个单个的声明
	- 如果是`VariableDeclaration`声明，并且是多变量声明（也就是有多个`declaration`）,给拆分为多个单声明语句。
		- export var a1, a3;
		- 在模块顶部 var a1, a2, a3;
	- 正常的语句正常创建`statement`
3. 执行模块的解析方法，给每个语句创建scope,并把其内部的declaration上绑定上父statement，方便操作

接下来我们去看`statement`在build过程中的一些操作

## Statement
```javascript
export default class Statement {
	constructor ( node, module, start, end ) {
		this.node = node;
		// 绑定父module，方便操作
		this.module = module;
		// 绑定当前语句的开始位置和结束位置
		this.start = start;
		this.end = end;
		// 在module中已经做了处理
		this.next = null; // filled in later
		// 创建一个当前语句的作用域
		this.scope = new Scope();
····// 保存当前语句引用的声明
		this.references = [];
		this.stringLiteralRanges = [];
		// 当前语句是否被使用
		this.isIncluded = false;

		this.isImportDeclaration = node.type === 'ImportDeclaration';
		this.isExportDeclaration = /^Export/.test( node.type );
		// export { xxx } from './xxx'
		this.isReexportDeclaration = this.isExportDeclaration && !!node.source;
	}
	// 语句分析
	analyse () {
		// import语句不需要分析，因为在module中已经存在imports
		if ( this.isImportDeclaration ) return; // nothing to analyse

		// attach scopes
		// 保存当前的作用域链到当前语句的`scope`上，其目的是为了方便找到该语句上使用的声明
		attachScopes( this );

		// attach statement to each top-level declaration,
		// so we can mark statements easily
		this.scope.eachDeclaration( ( name, declaration ) => {
			// 保存给每个声明挂上当前语句的引用，方便操作
			declaration.statement = this;
		});

		// find references
		let { module, references, scope, stringLiteralRanges } = this;
		let readDepth = 0;

		walk( this.node, {
			enter ( node, parent ) {
				if ( node.type === 'TemplateElement' ) stringLiteralRanges.push([ node.start, node.end ]);
				if ( node.type === 'Literal' && typeof node.value === 'string' && /\n/.test( node.raw ) ) {
					stringLiteralRanges.push([ node.start + 1, node.end - 1 ]);
				}

				if ( node._scope ) scope = node._scope;
				if ( /Function/.test( node.type ) && !isIife( node, parent ) ) readDepth += 1;

				// special case – shorthand properties. because node.key === node.value,
				// we can't differentiate once we've descended into the node
				// const a = 1; obj = { a } 这种的a属性叫做shorthand
				if ( node.type === 'Property' && node.shorthand ) {
					const reference = new Reference( node.key, scope );
					reference.isShorthandProperty = true; // TODO feels a bit kludgy
					references.push( reference );
					return this.skip();
				}

				let isReassignment;
				// var modifierNodes = {
				// 	AssignmentExpression: 'left', 分配表达式，也就是赋值 a.b.c = 1
				// 	UpdateExpression: 'argument' 更新表达式 a++/a--/++a/--a
				// };
				if ( parent && parent.type in modifierNodes ) {
					let subject = parent[ modifierNodes[ parent.type ] ];
					let depth = 0;
					// 如果左边还是一个MemberExpression表达式，就意味者是 obj.b.c = 1
					// 就一直找，知道找到最顶层的父级，也就是obj
					while ( subject.type === 'MemberExpression' ) {
						subject = subject.object;
						depth += 1;
					}
					// 在module的imports里找
					const importDeclaration = module.imports[ subject.name ];
					// 如果在作用域里没有发现这个对象，并且module里有引用这个对象
					// 意味着该变量是从其他模块引入，并且赋值了，分几种情况
					// 1. obj.a = 1,没有重新分配
					// 2. obj = {} // 报错
					// 3. a++; 被重新分配赋值了
					if ( !scope.contains( subject.name ) && importDeclaration ) {
						const minDepth = importDeclaration.name === '*' ?
							2 : // cannot do e.g. `namespace.foo = bar`
							1;  // cannot do e.g. `foo = bar`, but `foo.bar = bar` is fine

						if ( depth < minDepth ) {
							const err = new Error( `Illegal reassignment to import '${subject.name}'` );
							err.file = module.id;
							err.loc = getLocation( module.magicString.toString(), subject.start );
							throw err;
						}
					}

					isReassignment = !depth;
				}
				// 父节点是否与子节点存在引用关系
				if ( isReference( node, parent ) ) {
					// function declaration IDs are a special case – they're associated
					// with the parent scope
					const referenceScope = parent.type === 'FunctionDeclaration' && node === parent.id ?
						scope.parent :
						scope;

					const reference = new Reference( node, referenceScope );
					references.push( reference );

					reference.isImmediatelyUsed = !readDepth;
					reference.isReassignment = isReassignment;

					this.skip(); // don't descend from `foo.bar.baz` into `foo.bar`
				}
			},
			leave ( node, parent ) {
				if ( node._scope ) scope = scope.parent;
				if ( /Function/.test( node.type ) && !isIife( node, parent ) ) readDepth -= 1;
			}
		});
	}
	// 给当前语句打标记，目的是为了有标记的才输出source code
	mark () {...}
	// 标记副作用
	markSideEffect () {}
	// 获取当前语句的source code
	source () {...}

	// 获取当前语句的magicString
	toString () {
		return this.module.magicString.slice( this.start, this.end );
	}
}

// attchScope
export default function attachScopes ( statement ) {
	let { node, scope } = statement;
	walk( node, {
		enter ( node, parent ) {
			// function foo () {...}
			// class Foo {...}
			// 创建一个新的作用域
			if ( /(Function|Class)Declaration/.test( node.type ) ) {
				scope.addDeclaration( node, false, false );
			}

			// var foo = 1
			// var foo = function(){}
			if ( node.type === 'VariableDeclaration' ) {
				const isBlockDeclaration = blockDeclarations[ node.kind ];
				// only one declarator per block, because we split them up already
				scope.addDeclaration( node.declarations[0], isBlockDeclaration, true );
			}

			let newScope;

			// create new function scope
			// 如果当前node是一个function，则需要创建一个新的作用域
			// 因为接下来要递归他的子节点存放到他的声明中
			if ( /Function/.test( node.type ) ) {
				newScope = new Scope({
					parent: scope,
					block: false,
					params: node.params
				});

				// named function expressions - the name is considered
				// part of the function's scope
				// var foo = function(){}，需要创建一个新的声明到当前作用域
				if ( node.type === 'FunctionExpression' && node.id ) {
					newScope.addDeclaration( node, false, false );
				}
			}

			// create new block scope
			if ( node.type === 'BlockStatement' && !/Function/.test( parent.type ) ) {
				newScope = new Scope({
					parent: scope,
					block: true
				});
			}

			// catch clause has its own block scope
			if ( node.type === 'CatchClause' ) {
				newScope = new Scope({
					parent: scope,
					params: [ node.param ],
					block: true
				});
			}

			if ( newScope ) {
				// 如果新的作用域存在，则给当前节点打上标记，目的是为了离开当前节点时
				// 就意味着要去找父节点的兄弟节点，需要在离开时得到父节点的作用域
				Object.defineProperty( node, '_scope', {
					value: newScope,
					configurable: true
				});
				// 得到新的scope，因为要去递归它的面得声明/变量
				// function foo(){ var a1, a2 }
				scope = newScope;
			}
		},
		// 每次一个小节点被遍历完，就会触发leave
		// 这里也就是，如果该小节点有自己的scope，也就意味着该校节点是个块级作用域（function、class等）
		// 所以需要在离开的时候，也就是该去便利其他节点了，应该让scope等于parent scope
		leave ( node ) {
			if ( node._scope ) {
				scope = scope.parent;
			}
		}
	});
}
```

以上代码中Statement所做的事情如下：

1. 保存父module到自己身上方便操作，保存一些比较关键的信息(自己的scope、refrences、included等)
2. 解析当前语句
	- 如果该语句是import语句，则不需要解析（因为import语句是从其他模块引入引来的，在module层已经保留了imports，和关键词）
	- 保存自己的作用域，目的是为了方便寻找自己内部的一些变量
	- 给作用域里的每个声明增加当前语句的引用，目的是为了最终标记时，如果该作用域里的声明被使用，该语句一定是有副作用的，需要标记
	- 保存当前语句的引用，放入`refrences`里

直到这里，bundle的分析流程已经完结了，已经创建了一个依赖图，接下来我们看bundle在打包的时候是怎么只打包有被用到的代码

## 绑定依赖

``` javascript
// Bundle
export default class Bundle {
	constructor(){...}
	  // 打包
	build () {
		return Promise.resolve( this.resolveId( this.entry, undefined ) ) // 根据入口用过获取到source code`import {a} from 'b'`
			.then( id => this.fetchModule( id, undefined ) )
      // 入口文件对应的module
			.then( entryModule => {
				this.entryModule = entryModule;
				// 给该模块import的语句的妇保绑定上对应的模块
				// imort { a } from 'b',也就是把 a 绑定到 b
				this.modules.forEach( module => module.bindImportSpecifiers() );
				// 绑定别名
				this.modules.forEach( module => module.bindAliases() );
				// 绑定引用，很重要
				this.modules.forEach( module => module.bindReferences() );
				// mark all export statements
				entryModule.getExports().forEach( name => {
					const declaration = entryModule.traceExport( name );
					declaration.isExported = true;

					declaration.use();
				});
			});
	}
}

// Module

export default class Module {
	constructor(){...}
	bindReferences () {
		// 如果当前模块引入的是defaut,并且有标识符
		// exports.default
		if ( this.declarations.default ) {
			if ( this.exports.default.identifier ) {
				// 找到该标识符对应的声明
				const declaration = this.trace( this.exports.default.identifier );
				if ( declaration ) this.declarations.default.bind( declaration );
			}
		}

		this.statements.forEach( statement => {
			// skip `export { foo, bar, baz }`...
			if ( statement.node.type === 'ExportNamedDeclaration' && statement.node.specifiers.length ) {
				// ...unless this is the entry module
				if ( this !== this.bundle.entryModule ) return;
			}
			// 循环所有语句所引用的变量
			statement.references.forEach( reference => {
				// 优先从当前作用域去找
				// 其次从其他模块去追踪，关联
				// 目的是为了最后标记副作用的时候能给当前有副作用的模块所依赖的其他声明打上副作用
				const declaration = reference.scope.findDeclaration( reference.name ) ||
				                    this.trace( reference.name );

				if ( declaration ) {
					declaration.addReference( reference );
				} else {
					// TODO handle globals
					this.bundle.assumedGlobals[ reference.name ] = true;
				}
			});
		});
	}
	// 根据名字追踪该声明
	trace ( name ) {
		// 当前声明中有改变量名对应的声明就直接返回
		if ( name in this.declarations ) return this.declarations[ name ];
		// imports中有该变量，就说明是从其他模块引入的
		if ( name in this.imports ) {
			const importDeclaration = this.imports[ name ];
			// 找到该模块
			const otherModule = importDeclaration.module;

			if ( importDeclaration.name === '*' && !otherModule.isExternal ) {
				return otherModule.namespace();
			}
			// 从其他模块追踪export
			return otherModule.traceExport( importDeclaration.name, this );
		}

		return null;
	}

	traceExport ( name, importer ) {
		// export { foo } from './other'
		// 该变量在该模块是以这种形式导出的，就去追踪它所依赖的模块
		const reexportDeclaration = this.reexports[ name ];
		if ( reexportDeclaration ) {
			return reexportDeclaration.module.traceExport( reexportDeclaration.localName, this );
		}
		// 在该模块的exports中找到该变量
		const exportDeclaration = this.exports[ name ];
		if ( exportDeclaration ) {
			return this.trace( exportDeclaration.localName );
		}
		// 如果上面找不到，那么就在所有的模块中循环找该声明
		for ( let i = 0; i < this.exportAllModules.length; i += 1 ) {
			const module = this.exportAllModules[i];
			const declaration = module.traceExport( name, this );

			if ( declaration ) return declaration;
		}

		let errorMessage = `Module ${this.id} does not export ${name}`;
		if ( importer ) errorMessage += ` (imported by ${importer.id})`;

		throw new Error( errorMessage );
	}
}
```
上面主要内容是绑定依赖，也就是把模块之间的变量依赖所关联起来

1. 按照前语句所有的引用查找依赖
	- 如果能在作用域里查到，直接从作用域里拿
	- 如果当前作用域查不到，就从其他模块里找
2. 根据变量名追踪该变量名对应的声明
3. 绑定依赖

上面的流程已经把所有变量之间的引用给关联起来了，接下来我们看下如何标记副作用

## 标记副作用
```javascript
// bundle 的 build 方法里
let settled = false;
while ( !settled ) {
	settled = true;
	// 给所有模块标记副作用
	this.modules.forEach( module => {
		if ( module.markAllSideEffects() ) settled = false;
	});
}
// module
markAllSideEffects () {
	let hasSideEffect = false;
	// 找到该模块下的所有语句标记副作用
	this.statements.forEach( statement => {
		if ( statement.markSideEffect() ) hasSideEffect = true;
	});

	return hasSideEffect;
}

// statement
	mark () {
		if ( this.isIncluded ) return; // prevent infinite loops
		this.isIncluded = true;

		this.references.forEach( reference => {
			if ( reference.declaration ) reference.declaration.use();
		});
	}

	markSideEffect () {
		if ( this.isIncluded ) return;

		const statement = this;
		let hasSideEffect = false;

		walk( this.node, {
			enter ( node, parent ) {
				// node是一个函数且不是iife函数，直接忽略没有副作用
				if ( /Function/.test( node.type ) && !isIife( node, parent ) ) return this.skip();

				// If this is a top-level call expression, or an assignment to a global,
				// this statement will need to be marked
				// 如果是一个调用表达式，是存在副作用的
				if ( node.type === 'CallExpression' || node.type === 'NewExpression' ) {
					hasSideEffect = true;
				}

				else if ( node.type in modifierNodes ) {
					// a.x.y = 1
					// a++
					let subject = node[ modifierNodes[ node.type ] ];
					while ( subject.type === 'MemberExpression' ) subject = subject.object;
					// 根据变量名追踪该声明
					const declaration = statement.module.trace( subject.name );

					if ( !declaration || declaration.isExternal || declaration.statement.isIncluded ) {
						hasSideEffect = true;
					}
				}

				if ( hasSideEffect ) this.skip();
			}
		});

		if ( hasSideEffect ) statement.mark();
		return hasSideEffect;
	}

	// declaration
	use () {
		this.isUsed = true;
		if ( this.statement ) this.statement.mark();

		this.aliases.forEach( alias => alias.use() );
	}
```
以上是标记副作用的过程，它主要就是给语句、声明标记副作用

1. 该语句是调用表达式`CallExpression`/`NewExpression`标记副作用
2. 该语句是`AssignExpression`或者`UpdateExpression`，去找追踪node节点的声明
	- 如果该声明不存在 标记有副作用
	- 如果该声明是外部的，则标记副作用
	- 如果该声明所依赖的语句被使用了，则标记副作用
3. 给当前语句打上`isIncluded`同时给该语句所引用的声明标记`isUsed`

到这里完整的build流程就完事儿了，接下来就是输出source code

参考文档

[https://zhuanlan.zhihu.com/p/32831172](https://zhuanlan.zhihu.com/p/32831172)
[https://segmentfault.com/a/1190000040009496](https://segmentfault.com/a/1190000040009496)
[https://segmentfault.com/a/1190000040476979](https://segmentfault.com/a/1190000040476979)

## 其他

webpack4、5生产环境现在都支持了tree shaking，[副作用](https://zhuanlan.zhihu.com/p/32831172)几乎也没有，但是webpack现在代码量庞大，498 份JS文件 18862 行注释 73548 行代码，好处是在于生态圈庞大

rollup比较轻量级，适合开发一些小插件之类的库
