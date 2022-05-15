const lookHasSemicolonAtEnd = (str) => str === ';'

module.exports = {
    meta: {
        description: '这是一个检测语句结尾有没有分号的lint',
        fixable: 'whitespace', // 如果没有配置这个，即使实现了fixable，eslint也不会修正代码
        messages: {
            'endNotSemicolon': '语句结尾缺少分号' // lint错误提示
        }
    },
    create(context) {
        // 获取ast语法树
        const sourceCode = context.getSourceCode()
        return {
            VariableDeclaration(node) {
                const lastToken = sourceCode.getLastToken(node)
                if (!lookHasSemicolonAtEnd(lastToken.value)) {
                    context.report({
                        node: node,
                        loc: lastToken.loc,
                        messageId: 'endNotSemicolon',
                        fix: function (fixer) {
                            return fixer.insertTextAfter(node, ';')
                        }
                    })
                }
            },
            ExpressionStatement(node) {
                const lastToken = sourceCode.getLastToken(node)
                if (!lookHasSemicolonAtEnd(lastToken.value)) {
                    context.report({
                        node: node,
                        loc: lastToken.loc,
                        messageId: 'endNotSemicolon',
                        fix: function (fixer) {
                            return fixer.insertTextAfter(node, ';')
                        }
                    })
                }
            }
        }
    }
}
