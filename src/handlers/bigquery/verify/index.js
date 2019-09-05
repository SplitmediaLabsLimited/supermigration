const { getProjectId, getDatasetId, getTableId, getBQ, verifyCounts } = require('../helpers/getBQ');

module.exports = async function(toolbox) {
  const { config, parameters } = toolbox;

  const { projectId } = await getProjectId({ config, parameters });
  const { datasetId } = await getDatasetId({ projectId, parameters });
  const { tableIds } = await getTableId({ projectId, datasetId, parameters, multiple: true });

  const tables = tableIds.map(
    tableId =>
      getBQ({
        projectId,
        datasetId,
        tableId,
      }).table
  );

  await verifyCounts(...tables);
};
