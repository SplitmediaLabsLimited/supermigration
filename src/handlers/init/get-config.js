module.exports = async function check() {
  const findUp = require('find-up');

  const configPath = findUp.sync('supermigration.config.js');

  if (configPath) {
    return require(configPath);
  }

  return null;
};
