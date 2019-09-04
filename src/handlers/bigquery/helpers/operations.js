const { print } = require('gluegun');

module.exports.createTableFromSchema = async function(table, schema) {
  const spin = print.spin(`Creating table ${print.colors.warning(table.id)}`);
  await table.create(schema);
  spin.succeed(`Created table ${print.colors.warning(table.id)}`);
};

module.exports.copyTableFromAnotherTable = function(table, sourceTable) {
  return new Promise((resolve, reject) => {
    const spin = print.spin(
      `Copying data from ${print.colors.warning(sourceTable.id)} to ${print.colors.warning(table.id)}...`
    );
    table.createCopyFromJob(sourceTable).then(([job]) => {
      job.on('complete', metadata => {
        spin.succeed(`Copied data from ${print.colors.warning(sourceTable.id)} to ${print.colors.warning(table.id)}`);
        resolve(metadata);
      });

      job.on('error', err => {
        spin.fail();
        print.error();
        reject(err);
      });
    });
  });
};

module.exports.copyTableFromQuery = function(table, query) {
  return new Promise((resolve, reject) => {
    const spin = print.spin(`Copying data from query to ${print.colors.warning(table.id)}...`);
    table
      .createQueryJob({
        destination: table,
        query,
      })
      .then(([job]) => {
        job.on('complete', metadata => {
          spin.succeed(`Copied data from query to ${print.colors.warning(table.id)}`);
          resolve(metadata);
        });

        job.on('error', err => {
          spin.fail();
          print.error();
          reject(err);
        });
      });
  });
};

module.exports.deleteTable = async function(table) {
  const spin = print.spin(`Deleting table ${print.colors.warning(table.id)}...`);
  await table.delete();
  spin.succeed(`Deleted table ${print.colors.warning(table.id)}`);
};
