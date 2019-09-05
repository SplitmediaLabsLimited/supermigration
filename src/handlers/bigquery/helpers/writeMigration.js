const prettier = require('prettier');
const { prompt } = require('enquirer');
const { print, filesystem } = require('gluegun');

module.exports.writeMigration = async function writeMigration(filename, data) {
  const values = JSON.stringify(data, null, 2);

  const output = prettier.format(`module.exports = ${values};`, {
    parser: 'babel',
    singleQuote: true,
    trailingComma: 'es5',
  });

  await filesystem.writeAsync(filename, output);

  print.info(`Migration file generated: ${print.colors.success(filename)}`);
  print.info(`Modify the file, and run ${print.colors.warning('supermigration bigquery execute')}`);
};

module.exports.getDescription = async function getDescription() {
  return prompt({
    type: 'input',
    name: 'description',
    message: 'Enter a short description to explain the purpose of this migration',
  });
};
