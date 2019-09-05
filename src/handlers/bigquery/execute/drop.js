const { getBQ } = require('../helpers/getBQ');
const { deleteTable } = require('../helpers/operations');

module.exports = async function executeAlter({ migration }) {
  const { source } = migration;

  const sourceTable = getBQ(source).table;

  // delete old table
  await deleteTable(sourceTable);
};
