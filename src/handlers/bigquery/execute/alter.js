const { getBQ, verifyCounts } = require('../helpers/getBQ');
const {
  createTableFromSchema,
  copyTableFromQuery,
  copyTableFromAnotherTable,
  deleteTable,
} = require('../helpers/operations');

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

  // copy data from the old table to a backup table, but also to the new table
  await Promise.all([
    copyTableFromQuery(temporaryTable, source.query),
    copyTableFromAnotherTable(backupTable, originalTable),
  ]);

  await verifyCounts(originalTable, temporaryTable, backupTable);

  // delete the original table
  await deleteTable(originalTable);

  // copy the temporary table to the final table
  const finalTable = getBQ({
    ...destination,
    tableId: finalTableId,
  }).table;
  await copyTableFromAnotherTable(finalTable, temporaryTable);

  // delete the temporary table
  await deleteTable(temporaryTable);
};
