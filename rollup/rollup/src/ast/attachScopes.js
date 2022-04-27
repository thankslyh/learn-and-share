import { walk } from 'estree-walker';
import Scope from './Scope';

const blockDeclarations = {
	'const': true,
	'let': true
};

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
		leave ( node ) {
			if ( node._scope ) {
				scope = scope.parent;
			}
		}
	});
}
