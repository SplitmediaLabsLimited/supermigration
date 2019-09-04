const { getBQ } = require('../helpers/getBQ');
const { print } = require('gluegun');
const { createTableFromSchema, copyTableFromQuery, copyTableFromAnotherTable } = require('../helpers/operations');

function printStats(stats) {
  print.success('Statistics');
  print.success('==========');
  print.info(JSON.stringify(stats, null, 2));
  print.success('==========');
}

module.exports = async function executeAlter({ migration }) {
  const { destination, source } = migration;

  const temporaryTableId = `${destination.tableId}__temporary`;
  const backupTableId = `${destination.tableId}__backup_${new Date().getTime()}`;
  const finalTableId = destination.tableId;
  const originalTableId = destination.tableId;

  const temporaryTable = getBQ({
    ...destination,
    tableId: temporaryTableId,
  }).table;

  const backupTable = getBQ({
    ...destination,
    tableId: backupTableId,
  }).table;

  const originalTable = getBQ({
    ...destination,
    tableId: originalTableId,
  }).table;

  await createTableFromSchema(temporaryTable, migration.table);
  let stats = await copyTableFromQuery(temporaryTable, source.query);
  printStats(stats);

  // store a copy of the original table content
  stats = await copyTableFromAnotherTable(backupTable, originalTable);
  printStats(stats);

  // delete the original table
  await originalTable.delete();

  // copy the temporary table to the final table
  const finalTable = getBQ({
    ...destination,
    tableId: finalTableId,
  }).table;
  stats = await copyTableFromAnotherTable(finalTable, temporaryTable);
  printStats(stats);

  // delete the temporary table
  await temporaryTable.delete();
};
