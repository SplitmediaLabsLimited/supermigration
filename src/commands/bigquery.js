const { prompt } = require('enquirer');

async function getAction(parameters) {
  if (parameters.first) {
    return parameters.first;
  }

  const { action } = await prompt([
    {
      type: 'select',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { message: 'Alter existing table', value: 'alter' },
        { message: 'Copy existing table', value: 'copy' },
        { message: 'Copy existing table (schema only)', value: 'copy-schema' },
        { message: 'Create new table', value: 'create' },
        { message: 'Drop existing table', value: 'drop' },
        { message: 'Truncate existing table', value: 'truncate' },
        { message: 'Execute a migration', value: 'execute' },
        { message: 'Rename existing table', value: 'rename' },
        { message: 'Verify the row counts between multiple tables in the same dataset', value: 'verify' },
      ],
    },
  ]);

  return action;
}

module.exports = {
  name: 'bigquery',
  description: 'Interactive wizard to create a new migration for BigQuery',
  run: async toolbox => {
    const { parameters } = toolbox;

    await require('../handlers/init/check')();

    const action = await getAction(parameters);
    require(`../handlers/bigquery/${action}`)(toolbox);
  },
};
