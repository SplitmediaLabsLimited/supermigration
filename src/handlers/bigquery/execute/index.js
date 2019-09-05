const { prompt } = require('enquirer');
const { filesystem } = require('gluegun');
const path = require('path');

async function getMigrationFilename({ parameters }) {
  if (parameters.array[1]) {
    return {
      migrationFilename: parameters.array[1],
    };
  }

  const migrationFiles = await filesystem.findAsync('migrations/bigquery', {
    matching: '*.js',
  });

  return prompt({
    type: 'multiselect',
    name: 'migrations',
    message: 'Choose a migration to execute',
    initial: 'default',
    choices: migrationFiles.map(file => path.parse(file).name).reverse(),
  });
}

function getMigration(migrationFilename) {
  return require(path.resolve(process.cwd(), 'migrations', 'bigquery', migrationFilename));
}

module.exports = async function execute(toolbox) {
  const { config, parameters } = toolbox;

  const { migrations } = await getMigrationFilename({ parameters });

  for (const migrationFilename of migrations) {
    const migration = getMigration(migrationFilename);
    await require(`./${migration.action}`)({ config, migration });
  }
};
