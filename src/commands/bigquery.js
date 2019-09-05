const { prompt } = require('enquirer');

async function getAction(parameters) {
  if (parameters.first) {
    return parameters.first;
  }

  const { action } = await prompt([
    {
      type: 'select',
      name: 'action',
      message: 'Which database are you targeting?',
      initial: 'create',
      choices: [
        { message: 'Execute a migration', value: 'execute' },
        // { message: 'Create new table', value: 'create' },
        { message: 'Alter existing table', value: 'alter' },
        { message: 'Copy existing table', value: 'copy' },
        { message: 'Rename existing table', value: 'rename' },
        { message: 'Drop existing table', value: 'drop' },
      ],
    },
  ]);

  return action;
}

module.exports = {
  name: 'bigquery',
  run: async toolbox => {
    const { parameters } = toolbox;

    const action = await getAction(parameters);
    require(`../handlers/bigquery/${action}`)(toolbox);
  },
};
