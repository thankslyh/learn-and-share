const eslint = require('eslint')

const lint = new eslint.ESLint({
    // 是否自动修复
    fix: false,
    overrideConfig: {
        parserOptions: {
            ecmaVersion: 6,
        },
        rules: {
            // 自定义的lint
            'end-semicolon': ['error']
        }
    },
    // lint的目录
    rulePaths: [__dirname],
    // 不适用eslintrc
    useEslintrc: false
})

async function run() {
    const result = await lint.lintText(`
        const a = 1 + 1
        const b = a + 1
        console.log(a + b)
    `)
    const formatter = lint.loadFormatter('stylish')
    const resultText = (await formatter).format(result)
    console.log(resultText)
    // console.log(result)clea
}

run()
