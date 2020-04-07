const { getBQ } = require('../helpers/getBQ');
const { print } = require('gluegun');
const { prompt } = require('enquirer');
const { createTableFromSchema, deleteTable } = require('../helpers/operations');

module.exports = async function executeAlter({ migration }) {
  const { destination } = migration;
  const { table } = getBQ(destination);

  const [exists] = await table.exists();

  if (exists) {
    const { confirm } = await prompt({
      type: 'confirm',
      name: 'confirm',
      message: `This table already exists ${print.colors.warning(
        `(${destination.projectId}.${destination.datasetId}.${destination.tableId})`
      )}. Do you want to ${print.colors.error('delete and recreate')} this table?`,
    });

    if (confirm) {
      await deleteTable(table);
    } else {
      print.error('Exit!');
      process.exit(1);
    }
  }

  await createTableFromSchema(table, migration.table);
};
