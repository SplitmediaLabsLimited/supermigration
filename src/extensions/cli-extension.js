module.exports = async toolbox => {
  const config = await require('../handlers/init/get-config')();

  if (config) {
    toolbox.config = {
      ...toolbox.config,
      supermigration: {
        ...toolbox.config.supermigration,
        ...config,
      },
    };
  }
};
