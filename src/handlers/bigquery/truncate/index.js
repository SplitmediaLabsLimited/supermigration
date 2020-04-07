const { getProjectId, getDatasetId, getTableId, getTable } = require('../helpers/getBQ');
const { writeMigration } = require('../helpers/writeMigration');

module.exports = async function(toolbox) {
  const action = 'truncate';
  const { config, parameters } = toolbox;

  const { projectId } = await getProjectId({ config, parameters });
  const { datasetId } = await getDatasetId({ projectId, parameters });
  const { tableId } = await getTableId({ projectId, datasetId, parameters });
  const table = await getTable({ projectId, datasetId, tableId });

  const data = {
    type: 'bigquery',
    action,
    description: `Truncate table ${projectId}:${datasetId}.${tableId}`,
    source: null,
    destination: {
      projectId,
      datasetId,
      tableId,
    },
    table,
  };

  const filename = `migrations/bigquery/${projectId}/${new Date().getTime()}-${action}-${datasetId}-${tableId}.js`;

  await writeMigration(filename, data);
};
