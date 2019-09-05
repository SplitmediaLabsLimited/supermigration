const { prompt } = require('enquirer');
const { filesystem } = require('gluegun');
const path = require('path');
const { groupBy } = require('lodash');

async function getMigrationFilename({ parameters }) {
  if (parameters.array[1]) {
    return {
      migrationFilename: parameters.array[1],
    };
  }

  const migrationFiles = await filesystem.findAsync('migrations/bigquery', {
    matching: '*.js',
  });

  const groupedChoices = groupBy(
    migrationFiles.map(file => {
      const parsed = path.parse(file);
      const dirs = parsed.dir.split('/');
      const project = dirs.pop();

      return {
        name: parsed.name,
        project,
      };
    }),
    'project'
  );

  const choices = Object.keys(groupedChoices).map(project => {
    const choice = {
      name: project,
      choices: groupedChoices[project].map(migration => migration.name),
    };

    return choice;
  });

  return prompt({
    type: 'multiselect',
    name: 'migrations',
    message: 'Choose a migration to execute',
    initial: 'default',
    choices,
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
