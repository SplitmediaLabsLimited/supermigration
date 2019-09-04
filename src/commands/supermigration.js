const { prompt } = require('enquirer');

module.exports = {
  name: 'supermigration',
  run: async toolbox => {
    const { print } = toolbox;

    print.info(`Welcome to your SplitmediaLabs' SuperMigration tool`);
    const { database, action } = await prompt([
      {
        type: 'select',
        name: 'database',
        message: 'Which database are you targeting?',
        initial: 'bigquery',
        choices: [
          { message: 'BigQuery', value: 'bigquery' },
          { message: 'MySQL', value: 'mysql' }
        ]
      },
      {
        type: 'select',
        name: 'action',
        message: 'Which database are you targeting?',
        initial: 'create',
        choices: [
          { message: 'Create new table', value: 'create' },
          { message: 'Alter existing table', value: 'alter' },
          { message: 'Copy existing table', value: 'copy' },
          { message: 'Rename existing table', value: 'rename' },
          { message: 'Drop existing table', value: 'drop' }
        ]
      }
    ]);

    require(`../handlers/${database}/${action}`)(toolbox);

    console.log({ database, action });
  }
};
