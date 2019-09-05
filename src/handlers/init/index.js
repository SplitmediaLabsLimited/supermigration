const { prompt } = require('enquirer');
const { print } = require('gluegun');
const { getBQ } = require('../bigquery/helpers/getBQ');
const writeExports = require('../../helpers/write-exports');

async function checkAuthentication({ projectId }) {
  const spinner = print.spin(`Checking authentication...`);
  const { bigquery } = getBQ({
    projectId,
  });

  try {
    await bigquery.getDatasets();
    spinner.succeed(`Checked Authentication`);
    return;
  } catch (err) {
    spinner.fail(`Invalid project, or no access to project ${print.colors.warning(projectId)}`);
    print.error(err.message);
    process.exit(1);
  }
}

async function getProjectId() {
  return prompt({
    type: 'input',
    name: 'projectId',
    message: 'Enter a GCP Project ID that contains your BigQuery datasets',
  });
}

module.exports = async function init() {
  const { projectId } = await getProjectId();
  await checkAuthentication({ projectId });

  await writeExports('./supermigration.config.js', {
    bigquery: {
      default: {
        projectId,
      },
    },
  });
  print.success(`Created file ${print.colors.warning('supermigration.config.js')}`);
  print.info(`You can now run ${print.colors.warning(`supermigration bigquery`)} to start`);
};
