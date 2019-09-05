const { print } = require('gluegun');

module.exports = async function check() {
  const config = await require('./get-config')();

  if (config) {
    return true;
  }

  print.info(
    `No ${print.colors.warning('supermigration.config.js')} file found. ${print.colors.success(
      'Starting initialization process.'
    )}`
  );
  return require('./index')();
};
