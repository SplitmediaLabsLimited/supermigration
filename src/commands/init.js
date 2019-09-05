const { prompt } = require('enquirer');

module.exports = {
  name: 'init',
  description: 'Initialize config and stuff. You should start here',
  run: async toolbox => {
    const config = await require('../handlers/init/get-config')();

    if (config) {
      const { confirmed } = await prompt({
        type: 'confirm',
        name: 'confirmed',
        message: `You already have a configuration file. Continuing with the init step will overwrite it. Continue?`,
      });

      if (!confirmed) {
        process.exit(0);
      }
    }

    await require('../handlers/init')();
  },
};
