const lookHasSemicolonAtEnd = (str) => str === ';'

module.exports = {
    meta: {
        description: '这是一个检测语句结尾有没有分号的lint',
        fixable: false,
        messages: {
            'endNotSemicolon': '语句结尾缺少分号'
        }
    },
    create(context) {
        const sourceCode = context.getSourceCode()
        return {
            VariableDeclaration(node) {
                const lastToken = sourceCode.getLastToken(node)
                if (!lookHasSemicolonAtEnd(lastToken)) {
                    context.report({
                        node: node,
                        loc: lastToken.loc,
                        messageId: 'endNotSemicolon'
                    })
                }
            },
            CallExpression(node) {
                const lastToken = sourceCode.getLastToken(node)
                if (!lookHasSemicolonAtEnd(lastToken)) {
                    context.report({
                        node: node,
                        loc: lastToken.loc,
                        messageId: 'endNotSemicolon'
                    })
                }
            }
        }
    }
}
