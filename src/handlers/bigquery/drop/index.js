const { getProjectId, getDatasetId, getTableId } = require('../helpers/getBQ');
const { writeMigration } = require('../helpers/writeMigration');

module.exports = async function(toolbox) {
  const action = 'drop';
  const { config, parameters } = toolbox;

  const { projectId } = await getProjectId({ config, parameters });
  const { datasetId } = await getDatasetId({ projectId, parameters });
  const { tableId } = await getTableId({ projectId, datasetId, parameters });

  const data = {
    type: 'bigquery',
    action,
    description: `Drop table ${projectId}:${datasetId}.${tableId}`,
    source: {
      projectId,
      datasetId,
      tableId,
    },
    destination: null,
  };

  const filename = `migrations/bigquery/${projectId}/${new Date().getTime()}-${action}-${datasetId}-${tableId}.js`;

  await writeMigration(filename, data);
};
