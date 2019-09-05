const { prompt } = require('enquirer');
const { print, filesystem } = require('gluegun');
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
    migrationFiles
      .map(file => {
        const parsed = path.parse(file);
        const dirs = parsed.dir.split('/');
        const project = dirs.pop();

        return {
          name: parsed.name,
          project,
          file,
        };
      })
      .reverse(),
    'project'
  );

  const choices = Object.keys(groupedChoices).map(project => {
    const choice = {
      name: project,
      role: 'heading',
      choices: groupedChoices[project].map(migration => ({
        message: migration.name,
        value: migration.file,
      })),
    };

    return choice;
  });

  return prompt({
    type: 'multiselect',
    name: 'migrations',
    message: 'Choose a migration to execute',
    hint: 'press Spacebar to select',
    choices,
  });
}

function getMigration(migrationFilename) {
  const output = require(path.resolve(process.cwd(), migrationFilename));
  output.name = migrationFilename;
  return output;
}

module.exports = async function execute(toolbox) {
  const { config, parameters } = toolbox;

  const { migrations: migrationFilenames } = await getMigrationFilename({ parameters });

  const migrations = migrationFilenames.map(getMigration);

  print.warning('The following migrations will be ran:');
  print.info('');
  migrations.forEach(migration => {
    print.info(`  - ${migration.name} ${print.colors.muted(`(${migration.description})`)}`);
  });
  print.info('');

  const { confirmed } = await prompt({
    type: 'confirm',
    name: 'confirmed',
    message: 'Are you sure you want to run these migrations?',
  });

  if (!confirmed) {
    print.info('Canceled!');
    process.exit(1);
  }

  for (const migration of migrations) {
    await require(`./${migration.action}`)({ config, migration });
  }
};
