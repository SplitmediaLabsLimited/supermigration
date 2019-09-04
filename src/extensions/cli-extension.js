const findUp = require('find-up');

module.exports = toolbox => {
  const configPath = findUp.sync('supermigration.config.js');

  if (configPath) {
    const c = require(configPath);
    toolbox.config = {
      ...toolbox.config,
      supermigration: {
        ...toolbox.config.supermigration,
        ...c,
      },
    };
  }
};
