const { prompt } = require('enquirer');
const { print } = require('gluegun');
const writeExports = require('../../../helpers/write-exports');

module.exports.writeMigration = async function writeMigration(filename, data) {
  await writeExports(filename, data);

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
