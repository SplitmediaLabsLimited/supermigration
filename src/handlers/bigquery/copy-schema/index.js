const { prompt } = require('enquirer');
const { getProjectId, getDatasetId, getTableId, getTable } = require('../helpers/getBQ');
const { writeMigration } = require('../helpers/writeMigration');

module.exports = async function(toolbox) {
  const action = 'copy-schema';
  const { config, parameters } = toolbox;

  const { projectId } = await getProjectId({ config, parameters });
  const { datasetId } = await getDatasetId({ projectId, parameters });
  const { tableId } = await getTableId({ projectId, datasetId, parameters });
  const table = await getTable({ projectId, datasetId, tableId });
  const { destinationTableId } = await prompt({
    type: 'input',
    name: 'destinationTableId',
    message: 'Input a destination table',
    initial: tableId + '_Copy',
  });

  const data = {
    type: 'bigquery',
    action,
    description: `Copy schema from table ${projectId}:${datasetId}.${tableId} to ${projectId}:${datasetId}.${destinationTableId}`,
    source: null,
    destination: {
      projectId,
      datasetId,
      tableId: destinationTableId,
    },
    table,
  };

  const filename = `migrations/bigquery/${projectId}/${new Date().getTime()}-${action}-${datasetId}-${tableId}.js`;

  await writeMigration(filename, data);
};
