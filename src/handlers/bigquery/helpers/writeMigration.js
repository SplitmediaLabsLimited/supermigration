const prettier = require('prettier');
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
  print.info(
    `Modify the file, and run ${print.colors.warning(
      'supermigration bigquery execute'
    )}`
  );
};
