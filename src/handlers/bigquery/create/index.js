const { prompt } = require('enquirer');
const { getProjectId, getDatasetId, getTableId, getTable } = require('../helpers/getBQ');
const { getDescription, writeMigration } = require('../helpers/writeMigration');

module.exports = async function(toolbox) {
  const action = 'create';
  const { config, parameters } = toolbox;

  const { projectId } = await getProjectId({ config, parameters });
  const { datasetId } = await getDatasetId({ projectId, parameters });
  const { tableId } = await prompt({
    type: 'input',
    name: 'tableId',
    message: 'Input a table name',
  });
  const { description } = await getDescription();

  const data = {
    type: 'bigquery',
    action,
    description,
    source: null,
    destination: {
      projectId,
      datasetId,
      tableId,
    },
    table: {
      description,
      timePartitioning: {
        type: 'DAY',
        field: 'CreatedAt',
      },
      requirePartitionFilter: true,
      clustering: {
        fields: ['Id'],
      },
      schema: {
        fields: [
          {
            name: 'Id',
            type: 'INTEGER',
            mode: 'REQUIRED',
          },
          {
            name: 'CreatedAt',
            type: 'TIMESTAMP',
            mode: 'REQUIRED',
          },
        ],
      },
    },
  };

  const filename = `migrations/bigquery/${projectId}/${new Date().getTime()}-${action}-${datasetId}-${tableId}.js`;

  await writeMigration(filename, data);
};
