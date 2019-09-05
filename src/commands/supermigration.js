const { prompt } = require('enquirer');

module.exports = {
  name: 'supermigration',
  run: async toolbox => {
    return require('./bigquery').run(toolbox);
  },
};
