const { getProjectId, getDatasetId, getTableId, getTable } = require('../helpers/getBQ');
const { writeMigration } = require('../helpers/writeMigration');

module.exports = async function(toolbox) {
  const action = 'alter';
  const { config, parameters } = toolbox;

  const { projectId } = await getProjectId({ config, parameters });
  const { datasetId } = await getDatasetId({ projectId, parameters });
  const { tableId } = await getTableId({ projectId, datasetId, parameters });
  const table = await getTable({ projectId, datasetId, tableId });

  const data = {
    type: 'bigquery',
    action,
    source: {
      query: `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\``,
    },
    destination: {
      projectId,
      datasetId,
      tableId,
    },
    table,
  };

  const filename = `migrations/bigquery/${new Date().getTime()}-${action}-${datasetId}-${tableId}.js`;

  await writeMigration(filename, data);
};
