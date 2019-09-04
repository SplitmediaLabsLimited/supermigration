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
    type: 'select',
    name: 'migrationFilename',
    message: 'Choose a migration to execute',
    hint: `It won't get executed right away, no worries!`,
    initial: 'default',
    choices: migrationFiles.map(file => path.parse(file).name),
  });
}

function getMigration(migrationFilename) {
  return require(path.resolve(
    process.cwd(),
    'migrations',
    'bigquery',
    migrationFilename
  ));
}

module.exports = async function execute(toolbox) {
  const { config, parameters } = toolbox;

  const { migrationFilename } = await getMigrationFilename({ parameters });
  const migration = getMigration(migrationFilename);
  await require(`./${migration.action}`)({ config, migration });
};
