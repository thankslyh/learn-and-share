const path = require('path');
const rollup = require('./dist/rollup.js');

rollup.rollup({
	// eslint-disable-next-line comma-dangle
	entry: path.resolve(__dirname, './demo/index.js'),
}).then(module => {
	const source = module.generate();
	console.log(source.code);
});