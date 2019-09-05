const { getBQ } = require('../helpers/getBQ');
const { print } = require('gluegun');
const { createTableFromSchema, deleteTable, copyTableFromAnotherTable } = require('../helpers/operations');

function printStats(stats) {
  print.success('Statistics');
  print.success('==========');
  print.info(JSON.stringify(stats, null, 2));
  print.success('==========');
}

module.exports = async function executeAlter({ migration }) {
  const { destination, source } = migration;

  const sourceTable = getBQ(source).table;
  const destinationTable = getBQ(destination).table;

  // create new table
  await createTableFromSchema(destinationTable, migration.table);

  // copy data
  let stats = await copyTableFromAnotherTable(destinationTable, sourceTable);
  printStats(stats);

  // delete old table
  await deleteTable(sourceTable);
};
