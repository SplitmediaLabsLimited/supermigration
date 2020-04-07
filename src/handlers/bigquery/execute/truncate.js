const { getBQ } = require('../helpers/getBQ');
const { createTableFromSchema, copyTableFromAnotherTable, deleteTable } = require('../helpers/operations');

module.exports = async function executeAlter({ migration }) {
  const { destination } = migration;

  const backupTableId = `${destination.tableId}__backup_${new Date().getTime()}`;
  const finalTableId = destination.tableId;
  const originalTableId = destination.tableId;

  const backupTable = getBQ({
    ...destination,
    tableId: backupTableId,
  }).table;

  const originalTable = getBQ({
    ...destination,
    tableId: originalTableId,
  }).table;

  const finalTable = getBQ({
    ...destination,
    tableId: finalTableId,
  }).table;

  // create backup table
  await createTableFromSchema(backupTable, migration.table);

  // copy data from the old table to a backup table
  await copyTableFromAnotherTable(backupTable, originalTable);

  // delete the original table
  await deleteTable(originalTable);

  // recreate the schema
  await createTableFromSchema(finalTable, migration.table);
};
