const { BigQuery } = require('@google-cloud/bigquery');
const { print } = require('gluegun');
const { get } = require('lodash');
const { prompt } = require('enquirer');
const Promise = require('bluebird');

function getBQ({ projectId, datasetId, tableId }) {
  const output = {};

  if (projectId) {
    const bigquery = new BigQuery({ projectId });
    output.bigquery = bigquery;
  } else {
    const bigquery = new BigQuery();
    output.bigquery = bigquery;
  }

  if (datasetId) {
    output.dataset = output.bigquery.dataset(datasetId);
  }

  if (tableId) {
    output.table = output.dataset.table(tableId);
  }

  return output;
}

module.exports.getBQ = getBQ;

module.exports.getProjectId = async function getProjectId({ config, parameters }) {
  if (parameters.array[1]) {
    return {
      projectId: parameters.array[1],
    };
  }

  const projects = get(config, 'supermigration.bigquery', {});

  const projectsCount = Object.values(projects).length;
  if (projectsCount === 0) {
    print.error('No configuration found');
    process.exit(1);
    return;
  } else if (projectsCount === 1) {
    const def = Object.keys(projects)[0];
    print.info(
      `Automatically choosing environment: ${print.colors.warning(def)} ${print.colors.muted(
        `(${projects[def].projectId})`
      )}`
    );

    return projects[def];
  } else {
    return prompt({
      type: 'select',
      name: 'projectId',
      message: 'Choose an environment',
      initial: 'default',
      choices: Object.keys(projects).map(project => ({
        message: project,
        hint: projects[project].projectId,
        value: projects[project].projectId,
      })),
    });
  }
};

module.exports.getDatasetId = async function getDatasetId({ projectId, parameters }) {
  if (parameters.array[2]) {
    return {
      datasetId: parameters.array[2],
    };
  }

  const { bigquery } = getBQ({ projectId });
  const spinner = print.spin('Fetching datasets...');
  const [datasets] = await bigquery.getDatasets();
  spinner.stop();

  const choices = datasets.map(dataset => {
    return {
      name: dataset.id,
    };
  });

  return prompt({
    type: 'autocomplete',
    name: 'datasetId',
    message: 'Choose a dataset',
    initial: 'default',
    choices,
  });
};

module.exports.getTableId = async function getTableId({ projectId, datasetId, parameters, multiple = false }) {
  if (parameters.array[3]) {
    return {
      tableId: parameters.array[3],
    };
  }

  const { dataset } = getBQ({ projectId, datasetId });
  const spinner = print.spin('Fetching tables...');
  const [tables] = await dataset.getTables();
  spinner.stop();

  const choices = tables.map(table => {
    return {
      name: table.id,
    };
  });

  return await prompt({
    type: multiple ? 'multiselect' : 'autocomplete',
    name: multiple ? 'tableIds' : 'tableId',
    message: 'Choose a table',
    initial: 'default',
    choices,
  });
};

module.exports.getTable = async function getTable({ projectId, datasetId, tableId }) {
  const { table } = getBQ({ projectId, datasetId, tableId });
  const spinner = print.spin('Fetching table info...');
  const [{ metadata }] = await table.get();
  spinner.stop();

  const { schema, timePartitioning } = metadata;

  return { timePartitioning, schema };
};

module.exports.verifyCounts = async function(...tables) {
  const all = await Promise.map(tables, async table => {
    const [{ metadata }] = await table.get();

    const { id, numBytes, numRows } = metadata;

    return [id, numBytes, numRows];
  });

  const output = [['ID', 'Num. Bytes', 'Num. Rows'], ...all];

  print.table(output, {
    format: 'markdown',
  });
};
