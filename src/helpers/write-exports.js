module.exports = async function writeExports(filename, data) {
  const prettier = require('prettier');
  const { filesystem } = require('gluegun');

  const values = JSON.stringify(data, null, 2);

  const output = prettier.format(`module.exports = ${values};`, {
    parser: 'babel',
    singleQuote: true,
    trailingComma: 'es5',
  });

  await filesystem.writeAsync(filename, output);
};
